import type { UltraClawConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: UltraClawConfig, pluginId: string): UltraClawConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
