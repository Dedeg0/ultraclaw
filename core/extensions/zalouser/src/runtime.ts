import { createPluginRuntimeStore } from "ultraclaw/plugin-sdk/compat";
import type { PluginRuntime } from "ultraclaw/plugin-sdk/zalouser";

const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Zalouser runtime not initialized");
export { getZalouserRuntime, setZalouserRuntime };
