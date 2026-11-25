import { ModelProvider } from '../../ports/ModelProvider.js';

export class ProviderError extends Error {
  /**
   * @param {string} message
   * @param {number} [status]
   * @param {boolean} [retryable]
   * @param {string|null} [retryAfter]
   */
  constructor(message, status = 500, retryable = false, retryAfter = null) {
    super(message);
    this.name = 'ProviderError';
    this.status = status;
    this.retryable = retryable;
    this.retryAfter = retryAfter;
  }
}

export class GeminiProvider extends ModelProvider {
  constructor({
    apiKey = '',
    model = 'gemini-2.5-flash',
    timeoutMs = 12000
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  async generateRankedRecommendation({ systemPrompt, userPrompt }) {
    if (!this.apiKey) {
      throw new ProviderError('Gemini API key not configured', 503, false);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestPayload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 1200
      }
    };

    if (systemPrompt) {
      requestPayload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new ProviderError(
          `Gemini error (${response.status}): ${errorText.slice(0, 200)}`,
          response.status,
          response.status === 429 || (response.status >= 500 && response.status <= 504),
          response.headers.get('retry-after')
        );
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new ProviderError('Gemini returned empty candidate response', 502, true);
      }

      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        throw new ProviderError('Gemini returned malformed non-JSON payload', 502, false);
      }

      return {
        provider: 'google',
        model: this.model,
        output: parsed
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ProviderError(`Gemini request timed out after ${this.timeoutMs}ms`, 504, true);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateChatResponse({ systemPrompt, userPrompt }) {
    if (!this.apiKey) {
      throw new ProviderError('Gemini API key not configured', 503, false);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestPayload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 1000
      }
    };

    if (systemPrompt) {
      requestPayload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new ProviderError(
          `Gemini error (${response.status}): ${errorText.slice(0, 200)}`,
          response.status,
          response.status === 429 || (response.status >= 500 && response.status <= 504)
        );
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return {
        provider: 'google',
        model: this.model,
        text: rawText?.trim() || ''
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
