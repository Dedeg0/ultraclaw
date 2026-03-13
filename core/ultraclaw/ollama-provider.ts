/**
 * UltraClaw OS -- Ollama LLM Provider
 *
 * Direct integration with the local Ollama daemon.
 * Supports streaming and non-streaming chat completions.
 */

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatOptions {
  temperature?: number;
  top_p?: number;
  num_ctx?: number;
  stop?: string[];
}

export class OllamaProvider {
  readonly host: string;

  constructor(host = 'http://127.0.0.1:11434') {
    this.host = host;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.host}/api/tags`, {
        signal: AbortSignal.timeout(2000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    const res = await fetch(`${this.host}/api/tags`);
    if (!res.ok) throw new Error(`Ollama list failed: ${res.status}`);
    const data = await res.json() as { models: OllamaModel[] };
    return data.models ?? [];
  }

  async hasModel(name: string): Promise<boolean> {
    const models = await this.listModels();
    return models.some(m => m.name === name || m.name.startsWith(`${name}:`));
  }

  async chat(
    model: string,
    messages: OllamaChatMessage[],
    options: OllamaChatOptions = {}
  ): Promise<string> {
    const res = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false, options }),
    });
    if (!res.ok) throw new Error(`Ollama chat failed: ${res.status}`);
    const data = await res.json() as { message: OllamaChatMessage };
    return data.message.content;
  }

  async *chatStream(
    model: string,
    messages: OllamaChatMessage[],
    options: OllamaChatOptions = {}
  ): AsyncGenerator<string> {
    const res = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true, options }),
    });
    if (!res.ok) throw new Error(`Ollama stream failed: ${res.status}`);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split('\n').filter(Boolean)) {
        try {
          const chunk = JSON.parse(line) as { message?: OllamaChatMessage };
          if (chunk.message?.content) yield chunk.message.content;
        } catch { /* skip malformed chunks */ }
      }
    }
  }
}

export const ollama = new OllamaProvider(
  process.env['OLLAMA_HOST'] ?? 'http://127.0.0.1:11434'
);