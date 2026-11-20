import { ModelProvider } from '../../ports/ModelProvider.js';

export class GeminiProvider extends ModelProvider {
  constructor({ apiKey = '', model = 'gemini-3.6-flash' } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateRankedRecommendation(input) {
    if (!this.apiKey) {
      const err = new Error('Gemini API key not configured');
      err.status = 503;
      throw err;
    }

    // Call Google GenAI endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: JSON.stringify(input) }]
          }
        ]
      })
    });

    if (!response.ok) {
      const err = new Error(`Gemini error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    return {
      provider: 'google',
      model: this.model,
      rawOutput: data
    };
  }
}
