// Offline schema check for the llm-pi-ai settings section before installing it.
import { Config } from "/opt/homebrew/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-llm-pi-ai/lib/index.js";

const section = {
  providers: {
    "opencode-go": {
      displayName: "OpenCode Go",
      apiKeyEnv: "OPENCODE_API_KEY",
      api: "openai-completions",
      baseURL: "https://opencode.ai/zen/go/v1",
      headers: { "x-opencode-session": "dsh-session" },
      compat: {
        supportsStore: false,
        supportsDeveloperRole: false,
        supportsReasoningEffort: true,
        maxTokensField: "max_tokens",
        requiresReasoningContentOnAssistantMessages: true,
        thinkingFormat: "deepseek",
      },
      models: [
        {
          id: "deepseek-flash",
          name: "DeepSeek Flash",
          contextWindow: 1000000,
          maxTokens: 384000,
          reasoningEfforts: { off: null, low: "low", high: "high", max: "max" },
        },
      ],
    },
  },
};

try {
  const resolved = Config(section);
  console.log("OK", JSON.stringify(resolved, null, 1));
} catch (error) {
  console.error("FAIL", error?.message ?? error);
  process.exitCode = 1;
}
