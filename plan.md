# Nexus — implementation & design plan

## পণ্য ও আর্কিটেকচার
Nexus হবে ব্যক্তিগত ব্যবহারের জন্য একটি responsive, installable web chat app। এটি একক-user login ছাড়া চলবে। Existing React/TypeScript + Express starter reuse করা হবে; Server API request proxy হবে, কিন্তু কোনো provider/Tavily key server/database-এ persist করবে না। Settings-এ key sessionStorage-এ থাকবে ডিফল্টভাবে; user চাইলে নিজ browser-এ localStorage retention enable করতে পারবেন। Provider key প্রতি request-এ server route-এ পাঠিয়ে server ওই provider-এ proxy করবে। Published link-এ login নেই, তাই public URL যার কাছে থাকবে সে অ্যাপ খুলতে পারবে; key ব্যবহারকারী নিজে যোগ না করলে তার provider key server-এ থাকে না।

Provider logic এক shared validated OpenAI-compatible chat-completion path ব্যবহার করবে, এবং provider registry-তে base URL, model choices ও vision capability আলাদা থাকবে। OpenRouter, Google Gemini, Groq, Hugging Face, Together AI, Mistral, DeepSeek ও Cohere অন্তর্ভুক্ত থাকবে। Tavily search আলাদা server route-এ হবে। Auto Fallback key-configured provider-গুলো ধারাবাহিকভাবে চেষ্টা করবে; uploaded image থাকলে image-capable provider/model-এই fallback হবে। Model catalogs/quota provider-নির্ভর ও পরিবর্তনশীল; app-এ model ID edit করার উপায় থাকবে, এবং স্থায়ী free access-এর নিশ্চয়তা দেওয়া হবে না। Chat history React session state-এ থাকবে, server/database-এ নয়।

## Project structure
- `client/src/pages/Home.tsx` — chat layout, responsive sidebar, provider/model controls, draft image preview, message rendering, settings, research/fallback flow ও session history.
- `client/src/index.css` — custom Nexus visual system, chat bubbles, dark slate palette, mobile breakpoints.
- `client/index.html` — browser metadata ও app icon.
- `client/public/manifest.webmanifest` — Android home-screen install metadata ও app icon.
- `client/public/manus-routes.json` — root page route declaration.
- `server/nexusApi.ts` — provider registry, API-key validation, OpenAI-compatible adapters, Tavily search, bounded in-memory request throttling.
- `server/_core/index.ts` — `/api/chat` ও `/api/research` HTTP endpoints এবং existing health route.
- `app.config.ts` — Manus project logo metadata.
- `TODO.md` — requested outcomes ও progress.

## Design direction
তিনটি সম্ভাব্য দিক: **Midnight Editorial** — 0.06; **Soft Aurora Workspace** — 0.04; **Retro Terminal** — 0.03. নির্বাচিত: **Midnight Editorial**—গাঢ় নেভি/স্লেট UI, শ্বাস নেওয়ার মতো spacing, সংযত emerald accent, বাঁ-দিকের compact control rail ও প্রশস্ত chat canvas; প্রয়োজনীয় high-contrast surfaces.

- **Design movement:** Contemporary editorial software design—সুনিয়ন্ত্রিত typography ও calm dark workspace.
- **Core principles:** Focus-first; transparent provider status; low-friction image/research controls; graceful responsive behavior.
- **Color philosophy:** Midnight navy/slate গভীরতা ও মনোযোগ তৈরি করে; light gray reading clarity দেয়; emerald accent active/send states-এ ব্যবহার হবে, সাজসজ্জায় নয়.
- **Layout paradigm:** Desktop-এ slim fixed side rail ও বড় single conversational canvas; mobile-এ drawer sidebar এবং bottom composer.
- **Signature elements:** emerald “nexus” star-mark; soft-luminous selected-model chip; thin slate outlines ও layered message surfaces.
- **Interaction philosophy:** Key/API না থাকলে স্পষ্ট অবস্থা, sending/loading feedback, settings থেকে দ্রুত configure, upload preview ও সহজ clear-chat.
- **Animation:** Drawer ও settings panel 160–220ms ease-out; subtle message entrance; reduced-motion preference সম্মান; spinner শুধু pending request-এ.
- **Typography:** Inter system stack; headline semi-bold, body 15–16px, muted supporting text 12–13px; chat markdown-এ আরামদায়ক line-height.
- **Brand essence:** “নিজের পছন্দের AI-গুলোকে এক শান্ত কর্মক্ষেত্রে”—focused, adaptable, personal.
- **Brand voice:** সংক্ষিপ্ত, সহায়ক, চাপমুক্ত. উদাহরণ: “কোথা থেকে শুরু করব?”; “উত্তরের আগে ওয়েবে খুঁজুন”.
- **Wordmark & logo:** “Nexus” wordmark-এর পাশে generated emerald interlocking-nexus star icon; icon favicon ও install metadata-তেও যাবে.
- **Signature brand color:** Bright emerald `#53D9A7`.

## Serving
Express server on configured port 3000 serves the Vite app and same-origin JSON APIs. Static route `/manus-routes.json` covers `/`. Existing `features.server:true` is retained; database stays off because chat history and API keys are not persisted. Build/deploy configuration will use the initialized server Dockerfile and `/api/health` health check.
