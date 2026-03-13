/**
 * UltraClaw OS -- System Defaults
 * Overrides OpenCLAW defaults for OS integration
 */
export const ULTRACLAW_DEFAULTS = {
  // Gateway
  gatewayPort: 18790,
  configDir: '~/.ultraclaw',
  dataDir: '/var/claw',

  // LLM -- Ollama first, then remote APIs
  modelFallbackChain: ['ollama', 'anthropic', 'openai'],
  ollamaHost: 'http://127.0.0.1:11434',
  defaultModel: 'ollama/llama3.2',

  // Branding
  productName: 'UltraClaw OS',
  version: '0.1.0',
} as const;
