import { createPluginRuntimeStore } from "ultraclaw/plugin-sdk/compat";
import type { PluginRuntime } from "ultraclaw/plugin-sdk/telegram";

const { setRuntime: setTelegramRuntime, getRuntime: getTelegramRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Telegram runtime not initialized");
export { getTelegramRuntime, setTelegramRuntime };
