import type { UltraClawPluginApi } from "ultraclaw/plugin-sdk/synology-chat";
import { emptyPluginConfigSchema } from "ultraclaw/plugin-sdk/synology-chat";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for UltraClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: UltraClawPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
