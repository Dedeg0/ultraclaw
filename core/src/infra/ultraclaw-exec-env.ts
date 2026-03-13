export const ULTRACLAW_CLI_ENV_VAR = "ULTRACLAW_CLI";
export const ULTRACLAW_CLI_ENV_VALUE = "1";

export function markUltraClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [ULTRACLAW_CLI_ENV_VAR]: ULTRACLAW_CLI_ENV_VALUE,
  };
}

export function ensureUltraClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[ULTRACLAW_CLI_ENV_VAR] = ULTRACLAW_CLI_ENV_VALUE;
  return env;
}
