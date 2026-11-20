import { ModelProvider } from '../../ports/ModelProvider.js';

export class GroqProvider extends ModelProvider {
  constructor({ apiKey = '', model = 'openai/gpt-oss-120b', baseUrl = 'https://api.groq.com/openai/v1' } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async generateRankedRecommendation(input) {
    if (!this.apiKey) {
      const err = new Error('Groq API key not configured');
      err.status = 503;
      throw err;
    }

    const url = `${this.baseUrl}/chat/completions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: JSON.stringify(input) }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = new Error(`Groq error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    return {
      provider: 'groq',
      model: this.model,
      rawOutput: data
    };
  }
}
