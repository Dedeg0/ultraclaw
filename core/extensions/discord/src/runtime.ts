import { createPluginRuntimeStore } from "ultraclaw/plugin-sdk/compat";
import type { PluginRuntime } from "ultraclaw/plugin-sdk/discord";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };
