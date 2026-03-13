import { createPluginRuntimeStore } from "ultraclaw/plugin-sdk/compat";
import type { PluginRuntime } from "ultraclaw/plugin-sdk/tlon";

const { setRuntime: setTlonRuntime, getRuntime: getTlonRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Tlon runtime not initialized");
export { getTlonRuntime, setTlonRuntime };
