import type {
  AnyAgentTool,
  UltraClawPluginApi,
  UltraClawPluginToolFactory,
} from "ultraclaw/plugin-sdk/lobster";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: UltraClawPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as UltraClawPluginToolFactory,
    { optional: true },
  );
}
