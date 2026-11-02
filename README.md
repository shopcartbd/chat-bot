# Nexus — Personal AI Chat

Nexus is a responsive single-user AI chat workspace for text, coding help, image questions, and optional web research. No account login is required. The web app runs on the Manus-managed React/Express stack so it can be opened and used from a hosted link.

## Use Nexus

1. Open the published Nexus address in a browser.
2. Select **API key settings** and paste at least one provider API key. Add a Tavily key as well if you want Research mode.
3. In the sidebar choose a provider and model, enable **Research mode** or **Auto Fallback** as desired, and send a message. Use the paperclip button to attach a screenshot or image (up to 8 MB). Models/providers must support vision to answer about an image.
4. On Android, choose the browser menu's **Add to Home screen** or **Install app** command to install Nexus with its own icon.

## Providers

OpenRouter, Google Gemini, Groq, Hugging Face Inference API, Together AI, Mistral, DeepSeek, and Cohere are available. Enter provider API keys through **Settings** in the app. Keys are used to make server-proxied requests to the selected vendor; they are not stored in a Nexus database. By default they remain in browser session storage and disappear with the browser session. Optionally select **Remember keys on this device** to keep them in browser local storage. Use that only on a device you trust, and clear saved data through browser storage if needed.

Available model IDs and billing/free quotas can change at the provider's discretion. Review each provider's current dashboard and terms. Nexus does not guarantee that a provider/model will stay free. Auto Fallback tries the selected provider first, then other configured providers; for image questions it skips models not marked as vision-capable.

## Research and chat history

Research mode uses Tavily. Nexus sends the prompt and Tavily API key to its server for search, then includes result excerpts and source URLs with the selected model request. Chat history is in browser memory for the active page session, is not saved to an account or database, and can be removed with **Clear conversation**.

## Security and publication

The public app does not require login. Anyone with the published link can open it. Provider keys are provided by each browser user and are not saved in Nexus's server database; however, keys are transmitted over HTTPS through the Nexus server to the chosen provider when requests are made. Keep the link private if you want private access and do not use **Remember keys on this device** on a shared device. API usage, charges, quotas, retention and privacy policies are controlled by each external provider.

## Project layout

- `client/src/pages/Home.tsx` — chat UI, settings, model selection, key management, research, image upload, fallback and session history.
- `client/src/index.css` — Nexus design system, chat bubbles, animation and responsive mobile layout.
- `server/nexusApi.ts` — provider adapter routes, key/request validation, Tavily search, and request throttling.
- `shared/nexus.ts` — provider/model registry and vision capability metadata.
- `client/public/nexus-icon.svg` and `client/public/icons/` — scalable custom icon and Android app-icon sizes.
- `client/public/manifest.webmanifest` — installable web-app manifest.
- `client/public/manus-routes.json` — declared public page routes.
- `app.config.ts` — hosted project brand icon URL.

## Develop locally

This hosted project uses Node.js and pnpm (not the earlier standalone Streamlit ZIP):

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL reported by the dev server (normally port 3000). Run `pnpm check` for TypeScript diagnostics and `pnpm build` for a production build. Never commit provider keys or add them to source files.
