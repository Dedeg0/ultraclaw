/**
 * UltraClaw OS -- Ollama LLM Provider
 * Integrates local Ollama instance as primary model backend
 */
import { ULTRACLAW_DEFAULTS } from './defaults';

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaResponse {
  model: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
}

export class OllamaProvider {
  private host: string;

  constructor(host = ULTRACLAW_DEFAULTS.ollamaHost) {
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

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.host}/api/tags`);
    const data = await res.json() as { models: { name: string }[] };
    return data.models.map(m => m.name);
  }

  async chat(
    model: string,
    messages: OllamaMessage[],
    onChunk?: (text: string) => void
  ): Promise<string> {
    const res = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: !!onChunk }),
    });

    if (!res.ok) throw new Error(`Ollama error: ${res.status}`);

    if (!onChunk) {
      const data = await res.json() as OllamaResponse;
      return data.message.content;
    }

    // Streaming
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n').filter(Boolean)) {
        try {
          const data = JSON.parse(line) as OllamaResponse;
          if (data.message?.content) {
            full += data.message.content;
            onChunk(data.message.content);
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    return full;
  }
}
