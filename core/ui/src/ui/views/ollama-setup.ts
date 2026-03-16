import { html, nothing } from "lit";
import { icons } from "../icons.ts";

export type OllamaStatus = {
  installed: boolean;
  running: boolean;
  model: string;
  modelReady: boolean;
  installRunning: boolean;
};

export type OllamaSetupProps = {
  status: OllamaStatus | null;
  logLines: string[];
  installing: boolean;
  onInstall: () => void;
  onDismiss: () => void;
};

export function renderOllamaSetup(props: OllamaSetupProps) {
  if (!props.status) {
    return nothing;
  }

  // If everything is ready, don't show the card
  if (props.status.installed && props.status.modelReady) {
    return nothing;
  }

  const { model, installed, modelReady } = props.status;
  const { installing, logLines } = props;

  const steps = [
    {
      label: "Install Ollama",
      done: installed,
    },
    {
      label: `Pull model: ${model}`,
      done: modelReady,
    },
  ];

  return html`
    <div class="card ollama-setup" style="margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.08);">
      <div class="card-title" style="display:flex; align-items:center; gap:8px;">
        ${icons.cpu ?? html`<span>⚙</span>`}
        Local AI Setup
      </div>
      <div class="card-sub" style="margin-bottom: 16px;">
        UltraClaw needs Ollama and the <code>${model}</code> model to run locally.
      </div>

      <div class="ollama-steps" style="margin-bottom: 18px;">
        ${steps.map(
          (step) => html`
          <div class="ollama-step" style="display:flex; align-items:center; gap:10px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <span style="width:18px; flex-shrink:0;">
              ${step.done
                ? html`<span style="color: var(--color-success, #2FBF71);">✓</span>`
                : installing
                  ? html`<span style="color: var(--color-warn, #FFB020); animation: spin 1s linear infinite; display:inline-block;">⟳</span>`
                  : html`<span style="color: var(--color-muted, #666);">○</span>`}
            </span>
            <span style="color: ${step.done ? "var(--color-success, #2FBF71)" : "inherit"}">
              ${step.label}
            </span>
          </div>
        `,
        )}
      </div>

      ${
        logLines.length > 0
          ? html`
          <div class="ollama-log" style="
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 4px;
            padding: 10px 12px;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.6;
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 16px;
            color: #aaa;
          ">
            ${logLines.map((line) => html`<div>${line}</div>`)}
          </div>
        `
          : nothing
      }

      <div class="row" style="gap: 10px;">
        ${
          !installing
            ? html`
            <button
              class="btn primary"
              style="gap: 6px; display:flex; align-items:center;"
              @click=${props.onInstall}
            >
              Install Ollama + ${model}
            </button>
            <button
              class="btn"
              @click=${props.onDismiss}
              title="Use a remote API instead"
            >
              Skip (use remote API)
            </button>
          `
            : html`
            <button class="btn" disabled style="opacity:0.5; cursor:not-allowed;">
              Installing...
            </button>
          `
        }
      </div>

      <div class="muted" style="margin-top: 10px; font-size: 12px;">
        This will download ~4 GB. Make sure you have a stable internet connection.
      </div>
    </div>
  `;
}