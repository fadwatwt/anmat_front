export const AI_MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable model for complex tasks",
    icon: "🤖",
    color: "#10A37F",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast and efficient for everyday tasks",
    icon: "⚡",
    color: "#10A37F",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    description: "Specialized for code generation and analysis",
    icon: "💻",
    color: "#10A37F",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    icon: "🧠",
    color: "#D97757",
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude Opus 4",
    provider: "Anthropic",
    description: "Most powerful reasoning model",
    icon: "🎯",
    color: "#D97757",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Fast multimodal model",
    icon: "✨",
    color: "#4285F4",
  },
  {
    id: "big-pickle",
    name: "Big Pickle",
    provider: "Free",
    description: "Free model supported in the system",
    icon: "🥒",
    color: "#22C55E",
    isFree: true,
  },
];

export const DEFAULT_MODEL = "gpt-4o";

export const getModelById = (id) => AI_MODELS.find((m) => m.id === id) || AI_MODELS[0];

export const getModelsByProvider = () => {
  const providers = {};
  AI_MODELS.forEach((model) => {
    if (!providers[model.provider]) {
      providers[model.provider] = [];
    }
    providers[model.provider].push(model);
  });
  return providers;
};
