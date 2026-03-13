export class OllamaProvider {
  readonly host: string;
  constructor(host = 'http://127.0.0.1:11434') { this.host = host; }
  async isAvailable(): Promise<boolean> {
    try { const res = await fetch(`${this.host}/api/tags`, { signal: AbortSignal.timeout(2000) }); return res.ok; } catch { return false; }
  }
  async listModels(): Promise<{name:string}[]> {
    const res = await fetch(`${this.host}/api/tags`);
    const data = await res.json() as { models: {name:string}[] };
    return data.models ?? [];
  }
  async chat(model: string, messages: {role:string;content:string}[]): Promise<string> {
    const res = await fetch(`${this.host}/api/chat`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ model, messages, stream: false }) });
    const data = await res.json() as { message: {content:string} };
    return data.message.content;
  }
}
export const ollama = new OllamaProvider(process.env['OLLAMA_HOST'] ?? 'http://127.0.0.1:11434');

