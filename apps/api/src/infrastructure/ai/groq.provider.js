import { ModelProvider } from '../../ports/ModelProvider.js';

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
      const err = new Error('Groq API key not configured');
      err.status = 503;
      err.retryable = false;
      throw err;
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
        const err = new Error(`Groq error (${response.status}): ${errorText.slice(0, 200)}`);
        err.status = response.status;
        err.retryable = response.status === 429 || (response.status >= 500 && response.status <= 504);
        err.retryAfter = response.headers.get('retry-after');
        throw err;
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        const err = new Error('Groq returned empty choice content');
        err.status = 502;
        err.retryable = true;
        throw err;
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
        const err = new Error('Groq returned malformed non-JSON payload');
        err.status = 502;
        err.retryable = false;
        throw err;
      }

      return {
        provider: 'groq',
        model: this.model,
        output: parsed
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Groq request timed out after ${this.timeoutMs}ms`);
        timeoutErr.status = 504;
        timeoutErr.retryable = true;
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateChatResponse({ systemPrompt, userPrompt }) {
    if (!this.apiKey) {
      const err = new Error('Groq API key not configured');
      err.status = 503;
      throw err;
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
        const err = new Error(`Groq error (${response.status}): ${errorText.slice(0, 200)}`);
        err.status = response.status;
        err.retryable = response.status === 429 || (response.status >= 500 && response.status <= 504);
        throw err;
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
