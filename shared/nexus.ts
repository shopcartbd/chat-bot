export const PROVIDERS = {
  openrouter: {
    label: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1",
    keyLabel: "OpenRouter API key",
    models: [
      { id: "google/gemma-3-27b-it:free", label: "Gemma 3 27B · Free", vision: true },
      { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 · Free", vision: false },
      { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B · Free", vision: false },
    ],
  },
  gemini: {
    label: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/openai",
    keyLabel: "Gemini API key",
    models: [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", vision: true },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", vision: true },
    ],
  },
  groq: {
    label: "Groq",
    endpoint: "https://api.groq.com/openai/v1",
    keyLabel: "Groq API key",
    models: [
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", vision: false },
      { id: "openai/gpt-oss-120b", label: "GPT OSS 120B", vision: false },
    ],
  },
  huggingface: {
    label: "Hugging Face",
    endpoint: "https://router.huggingface.co/v1",
    keyLabel: "Hugging Face token",
    models: [
      { id: "Qwen/Qwen2.5-72B-Instruct", label: "Qwen 2.5 72B", vision: false },
      { id: "Qwen/Qwen2.5-VL-72B-Instruct", label: "Qwen 2.5 VL 72B · Vision", vision: true },
    ],
  },
  together: {
    label: "Together AI",
    endpoint: "https://api.together.xyz/v1",
    keyLabel: "Together AI API key",
    models: [
      { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", label: "Llama 3.3 70B Turbo", vision: false },
      { id: "Qwen/Qwen2.5-72B-Instruct-Turbo", label: "Qwen 2.5 72B Turbo", vision: false },
    ],
  },
  mistral: {
    label: "Mistral",
    endpoint: "https://api.mistral.ai/v1",
    keyLabel: "Mistral API key",
    models: [
      { id: "mistral-small-latest", label: "Mistral Small", vision: false },
      { id: "pixtral-12b-2409", label: "Pixtral 12B · Vision", vision: true },
    ],
  },
  deepseek: {
    label: "DeepSeek",
    endpoint: "https://api.deepseek.com/v1",
    keyLabel: "DeepSeek API key",
    models: [
      { id: "deepseek-chat", label: "DeepSeek Chat", vision: false },
      { id: "deepseek-reasoner", label: "DeepSeek Reasoner", vision: false },
    ],
  },
  cohere: {
    label: "Cohere",
    endpoint: "https://api.cohere.com/compatibility/v1",
    keyLabel: "Cohere API key",
    models: [
      { id: "command-a-03-2025", label: "Command A", vision: false },
      { id: "command-r-08-2024", label: "Command R", vision: false },
    ],
  },
} as const;

export type ProviderId = keyof typeof PROVIDERS;
export type ModelOption = (typeof PROVIDERS)[ProviderId]["models"][number];
export const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];
export const TAVILY_KEY_ID = "tavily" as const;
export const NEXUS_ICON = "/manus-storage/async-images/SUhl5sozDoXrilylYpKEXa/image-1.webp";
