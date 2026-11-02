# Nexus অ্যাপ চালানোর নিয়ম

Nexus হলো ব্যক্তিগত AI chat web app। এটি Node.js + React + Express ব্যবহার করে। কোনো login লাগবে না।

## চালু করুন

1. ZIP extract করুন এবং `nexus-chatbot/` ফোল্ডারে terminal খুলুন।
2. Node.js 20+ ও pnpm 10.18 বা নতুন সংস্করণ ইনস্টল করুন।
3. dependency বসাতে চালান:

   ```bash
   pnpm install --frozen-lockfile
   ```

4. অ্যাপ চালাতে লিখুন:

   ```bash
   pnpm dev
   ```

5. terminal-এ দেখানো local address—সাধারণত `http://localhost:3000`—browser-এ খুলুন।
6. **API key settings** খুলে আপনার OpenRouter, Gemini, Groq, Hugging Face, Together, Mistral, DeepSeek বা Cohere key দিন। Tavily key দিলে Research mode-ও চলবে।

ফোনে ব্যবহার করতে একই network-এ computer-এর local IP address দিয়ে খুলতে পারেন। Public internet থেকে চালাতে hosting/deployment করতে হবে।

## ফিচার

- একাধিক AI provider এবং model বাছাই
- Settings-এ হাতে API key বসানো; default-এ key browser session-এ থাকে
- Auto Fallback, Tavily Research, image/screenshot upload
- Chat history current browser session-এ থাকে; **Clear conversation** দিয়ে মুছুন
- Android-এ browser menu থেকে **Add to Home screen** দিলে app icon-সহ যোগ করা যায়

Provider-দের free quota, model name এবং billing বদলাতে পারে। কোনো provider সবসময় ফ্রি থাকবে—এ নিশ্চয়তা নেই। API key GitHub বা public source code-এ দেবেন না।

## দরকারি ফাইল

- `client/src/pages/Home.tsx` — মূল chat screen ও settings
- `server/nexusApi.ts` — AI provider ও Tavily API routes
- `shared/nexus.ts` — provider/model তালিকা
- `client/public/nexus-icon.svg`, `client/public/icons/` — Nexus app icon
- `client/public/manifest.webmanifest` — installable app metadata
- `README.md` — সম্পূর্ণ technical notes
