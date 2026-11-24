import express from 'express';
import cors from 'cors';
import { securityHeaders } from './middleware/securityHeaders.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimit } from './middleware/rateLimit.js';
import { authenticateOptional } from './middleware/authenticateOptional.js';
import { createHealthRoutes } from './routes/health.routes.js';
import { createAirQualityRoutes } from './routes/airQuality.routes.js';
import { createRecommendationRoutes } from './routes/recommendation.routes.js';
import { createIndoorRoutes } from './routes/indoor.routes.js';
import { createFeedbackRoutes } from './routes/feedback.routes.js';
import { createPreferencesRoutes } from './routes/preferences.routes.js';
import { createAssistantRoutes } from './routes/assistant.routes.js';
import { env } from './config/env.js';

export function createApp(container) {
  const app = express();

  const allowedOrigins = new Set(
    [
      env.WEB_ORIGIN,
      'https://dayshift-opal.vercel.app',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173'
    ].filter(Boolean)
  );

  app.use(securityHeaders());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow mobile, CLI, or same-origin requests without Origin header
        if (!origin) return callback(null, true);

        if (allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        // Reject unapproved origins
        const corsErr = new Error(`Origin ${origin} not permitted by DayShift CORS policy.`);
        corsErr.status = 403;
        corsErr.code = 'CORS_ORIGIN_DENIED';
        return callback(corsErr, false);
      },
      credentials: true
    })
  );
  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(rateLimit({ windowMs: 60000, max: 120 }));
  app.use(authenticateOptional);

  // Mount API Routes under /api/v1
  const apiRouter = express.Router();
  apiRouter.use(createHealthRoutes());
  apiRouter.use(createAirQualityRoutes({ airQualityController: container.airQualityController }));
  apiRouter.use(
    createRecommendationRoutes({ recommendationController: container.recommendationController })
  );
  apiRouter.use(createIndoorRoutes({ indoorController: container.indoorController }));
  apiRouter.use(createFeedbackRoutes());
  apiRouter.use(createPreferencesRoutes({ preferenceRepository: container.preferenceRepository }));
  apiRouter.use(
    createAssistantRoutes({
      getAirEvidenceUseCase: container.getAirEvidenceUseCase,
      geminiProvider: container.geminiProvider,
      groqProvider: container.groqProvider
    })
  );

  app.use('/api/v1', apiRouter);

  app.use(errorHandler);

  return app;
}
