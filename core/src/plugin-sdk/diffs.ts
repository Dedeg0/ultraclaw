// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { UltraClawConfig } from "../config/config.js";
export { resolvePreferredUltraClawTmpDir } from "../infra/tmp-ultraclaw-dir.js";
export type {
  AnyAgentTool,
  UltraClawPluginApi,
  UltraClawPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";
