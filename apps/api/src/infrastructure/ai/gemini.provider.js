import { ModelProvider } from '../../ports/ModelProvider.js';

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
      const err = new Error('Gemini API key not configured');
      err.status = 503;
      err.retryable = false;
      throw err;
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
        const err = new Error(`Gemini error (${response.status}): ${errorText.slice(0, 200)}`);
        err.status = response.status;
        err.retryable = response.status === 429 || (response.status >= 500 && response.status <= 504);
        err.retryAfter = response.headers.get('retry-after');
        throw err;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        const err = new Error('Gemini returned empty candidate response');
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
        const err = new Error('Gemini returned malformed non-JSON payload');
        err.status = 502;
        err.retryable = false;
        throw err;
      }

      return {
        provider: 'google',
        model: this.model,
        output: parsed
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Gemini request timed out after ${this.timeoutMs}ms`);
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
      const err = new Error('Gemini API key not configured');
      err.status = 503;
      throw err;
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
        const err = new Error(`Gemini error (${response.status}): ${errorText.slice(0, 200)}`);
        err.status = response.status;
        err.retryable = response.status === 429 || (response.status >= 500 && response.status <= 504);
        throw err;
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
