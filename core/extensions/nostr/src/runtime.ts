import { createPluginRuntimeStore } from "ultraclaw/plugin-sdk/compat";
import type { PluginRuntime } from "ultraclaw/plugin-sdk/nostr";

const { setRuntime: setNostrRuntime, getRuntime: getNostrRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Nostr runtime not initialized");
export { getNostrRuntime, setNostrRuntime };
