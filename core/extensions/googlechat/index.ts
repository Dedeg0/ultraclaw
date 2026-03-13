import type { UltraClawPluginApi } from "ultraclaw/plugin-sdk/googlechat";
import { emptyPluginConfigSchema } from "ultraclaw/plugin-sdk/googlechat";
import { googlechatDock, googlechatPlugin } from "./src/channel.js";
import { setGoogleChatRuntime } from "./src/runtime.js";

const plugin = {
  id: "googlechat",
  name: "Google Chat",
  description: "UltraClaw Google Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: UltraClawPluginApi) {
    setGoogleChatRuntime(api.runtime);
    api.registerChannel({ plugin: googlechatPlugin, dock: googlechatDock });
  },
};

export default plugin;
