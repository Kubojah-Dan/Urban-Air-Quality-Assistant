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

export class GroqProvider extends ModelProvider {
  constructor({
    apiKey = '',
    model = 'openai/gpt-oss-120b',
    baseUrl = 'https://api.groq.com/openai/v1',
    timeoutMs = 12000
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async generateRankedRecommendation({ systemPrompt, userPrompt }) {
    if (!this.apiKey) {
      throw new ProviderError('Groq API key not configured', 503, false);
    }

    const url = `${this.baseUrl}/chat/completions`;

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const requestPayload = {
      model: this.model,
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 1200
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new ProviderError(
          `Groq error (${response.status}): ${errorText.slice(0, 200)}`,
          response.status,
          response.status === 429 || (response.status >= 500 && response.status <= 504),
          response.headers.get('retry-after')
        );
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new ProviderError('Groq returned empty choice content', 502, true);
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
        throw new ProviderError('Groq returned malformed non-JSON payload', 502, false);
      }

      return {
        provider: 'groq',
        model: this.model,
        output: parsed
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ProviderError(`Groq request timed out after ${this.timeoutMs}ms`, 504, true);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateChatResponse({ systemPrompt, userPrompt }) {
    if (!this.apiKey) {
      throw new ProviderError('Groq API key not configured', 503, false);
    }

    const url = `${this.baseUrl}/chat/completions`;
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const requestPayload = {
      model: this.model,
      messages,
      max_tokens: 1000
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new ProviderError(
          `Groq error (${response.status}): ${errorText.slice(0, 200)}`,
          response.status,
          response.status === 429 || (response.status >= 500 && response.status <= 504)
        );
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      return {
        provider: 'groq',
        model: this.model,
        text: rawText?.trim() || ''
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
