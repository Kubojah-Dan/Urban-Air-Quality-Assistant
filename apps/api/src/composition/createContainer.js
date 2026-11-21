import { OpenMeteoClient } from '../infrastructure/data-sources/openMeteo/openMeteo.client.js';
import { OpenMeteoAdapter } from '../infrastructure/data-sources/openMeteo/openMeteo.adapter.js';
import { AirNowClient } from '../infrastructure/data-sources/airNow/airNow.client.js';
import { AirNowAdapter } from '../infrastructure/data-sources/airNow/airNow.adapter.js';
import { CpcbClient } from '../infrastructure/data-sources/cpcb/cpcb.client.js';
import { CpcbAdapter } from '../infrastructure/data-sources/cpcb/cpcb.adapter.js';
import { GeminiProvider } from '../infrastructure/ai/gemini.provider.js';
import { GroqProvider } from '../infrastructure/ai/groq.provider.js';
import { ModelRouter } from '../infrastructure/ai/modelRouter.js';
import { RedisCacheStore } from '../infrastructure/cache/redisCacheStore.js';
import { EvidenceAssembler } from '../application/services/evidenceAssembler.js';
import { CandidateBuilder } from '../application/services/candidateBuilder.js';
import { RecommendationOrchestrator } from '../application/services/recommendationOrchestrator.js';
import { GetAirEvidenceUseCase } from '../application/use-cases/getAirEvidence.js';
import { CreateRecommendationUseCase } from '../application/use-cases/createRecommendation.js';
import { ReviseRecommendationUseCase } from '../application/use-cases/reviseRecommendation.js';
import { GetIndoorGuidanceUseCase } from '../application/use-cases/getIndoorGuidance.js';
import { AirQualityController } from '../controllers/airQuality.controller.js';
import { RecommendationController } from '../controllers/recommendation.controller.js';
import { IndoorController } from '../controllers/indoor.controller.js';
import { env } from '../config/env.js';

export function createContainer() {
  // 1. Data Source Clients & Adapters
  const openMeteoClient = new OpenMeteoClient(env.OPEN_METEO_BASE_URL);
  const openMeteoAdapter = new OpenMeteoAdapter(openMeteoClient);

  const airNowClient = new AirNowClient(env.AIRNOW_API_KEY);
  const airNowAdapter = new AirNowAdapter(airNowClient);

  const cpcbClient = new CpcbClient(env.CPCB_API_KEY);
  const cpcbAdapter = new CpcbAdapter(cpcbClient);

  const cacheStore = new RedisCacheStore();

  // 2. AI Providers & Router
  const geminiProvider = new GeminiProvider({
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    timeoutMs: env.MODEL_REQUEST_TIMEOUT_MS
  });
  const groqProvider = new GroqProvider({
    apiKey: env.GROQ_API_KEY,
    model: env.GROQ_MODEL,
    timeoutMs: env.MODEL_REQUEST_TIMEOUT_MS
  });

  const modelRouter = new ModelRouter({
    primaryProvider: geminiProvider,
    fallbackProvider: groqProvider,
    enableFallback: env.AI_ENABLE_FALLBACK,
    maxRetriesPerProvider: env.MODEL_MAX_RETRIES_PER_PROVIDER
  });

  // 3. Application Services
  const evidenceAssembler = new EvidenceAssembler({
    airQualityProviders: [openMeteoAdapter, airNowAdapter, cpcbAdapter]
  });
  const candidateBuilder = new CandidateBuilder();
  const recommendationOrchestrator = new RecommendationOrchestrator({
    modelRouter,
    candidateBuilder
  });

  // 4. Use Cases
  const getAirEvidenceUseCase = new GetAirEvidenceUseCase({
    evidenceAssembler,
    cacheStore
  });
  const createRecommendationUseCase = new CreateRecommendationUseCase({
    getAirEvidenceUseCase,
    recommendationOrchestrator
  });
  const reviseRecommendationUseCase = new ReviseRecommendationUseCase({
    createRecommendationUseCase
  });
  const getIndoorGuidanceUseCase = new GetIndoorGuidanceUseCase();

  // 5. Controllers
  const airQualityController = new AirQualityController({ getAirEvidenceUseCase });
  const recommendationController = new RecommendationController({
    createRecommendationUseCase,
    reviseRecommendationUseCase
  });
  const indoorController = new IndoorController({ getIndoorGuidanceUseCase });

  return {
    airQualityController,
    recommendationController,
    indoorController,
    createRecommendationUseCase,
    reviseRecommendationUseCase,
    getAirEvidenceUseCase,
    getIndoorGuidanceUseCase
  };
}
