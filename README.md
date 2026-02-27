# DevLog — Daily Task Tracker → Year-End Evaluation

A **Next.js + TypeScript + Tailwind CSS** web app for developers to log daily tasks and use AI to compile them into year-end performance evaluations.

Built for the **LintraMax Performance Evaluation Form** format.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
#    → http://localhost:3000
```

That's it! No database setup needed — data is stored in localStorage.

---

## 📁 Project Structure

```
devlog-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root HTML layout
│   │   ├── page.tsx            # Main page (orchestrates all components)
│   │   ├── globals.css         # Tailwind + custom theme
│   │   └── api/
│   │       └── compile/
│   │           └── route.ts    # Server-side API proxy to Anthropic
│   ├── components/
│   │   ├── Header.tsx          # Top nav bar
│   │   ├── EntryForm.tsx       # Add/edit task form
│   │   ├── EntryList.tsx       # Task list grouped by month → date
│   │   ├── StatsBar.tsx        # Category count chips
│   │   ├── Modal.tsx           # Reusable modal wrapper
│   │   ├── SettingsModal.tsx   # Employee info + API key
│   │   ├── CompileModal.tsx    # AI compilation UI
│   │   ├── DataModal.tsx       # Backup/restore/clear
│   │   └── Toast.tsx           # Notification popup
│   ├── hooks/
│   │   └── index.ts            # useEntries, useSettings, useToast
│   ├── lib/
│   │   ├── constants.ts        # KPI categories, AI config
│   │   ├── storage.ts          # localStorage wrapper
│   │   ├── ai.ts               # AI prompt builder + API caller
│   │   ├── export-import.ts    # Backup/restore/download
│   │   └── date.ts             # Date formatting
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

### Architecture Decisions

| Layer | Purpose | Easy to swap? |
|-------|---------|---------------|
| **Components** | UI rendering (React) | Yes — each is self-contained |
| **Hooks** | State management | Yes — replace with Zustand/Redux if needed |
| **lib/storage.ts** | Data persistence (localStorage) | ✅ Swap to Supabase later |
| **lib/ai.ts** | AI compilation (Anthropic) | ✅ Swap to OpenAI/Gemini |
| **app/api/** | Server-side proxy | ✅ Add auth, rate limiting |

---

## 💾 How Data Storage Works

Currently uses **localStorage** (browser-only storage):

- Data stored as JSON strings inside the browser
- Persists across restarts (~5-10 MB limit)
- NOT synced across devices/browsers
- Lost if user clears browser data
- **Always export backups regularly!**

### Future: Supabase Migration Path

When ready for multi-user support:

1. `npm install @supabase/supabase-js`
2. Create a Supabase project at [supabase.com](https://supabase.com)
3. Swap `lib/storage.ts` functions to use Supabase client
4. Add auth in `layout.tsx` with Supabase Auth
5. The rest of the app stays the same!

---

## 🔑 API Key Setup

1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Create an API key → add credits ($5 minimum)
3. Paste into DevLog Settings (⚙️ button)
4. Key is stored in localStorage, sent server-side via `/api/compile`

**Why server-side proxy?** The `/api/compile` route acts as a proxy:
- No CORS issues (server → Anthropic, not browser → Anthropic)
- You can add rate limiting, logging, auth later
- More secure than direct browser calls

---

## 🔧 Customization

### KPI Categories → `src/lib/constants.ts`
```typescript
export const CATEGORIES: Category[] = [
  { id: "initiative", label: "Your Custom KPI", ... },
];
```

### AI Prompt → `src/lib/ai.ts`
Edit `buildPrompt()` to match your company's evaluation format.

### AI Model → `src/lib/constants.ts`
```typescript
export const AI_CONFIG = {
  MODEL: "claude-sonnet-4-20250514",  // change model here
};
```

### Styling → `src/app/globals.css`
All theme colors are CSS variables under `@theme { }`.

---

## 📦 Deployment

### Vercel (Recommended — Free)
```bash
npm install -g vercel
vercel
```
Follow prompts. Done! Automatic HTTPS, global CDN.

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export (for SharePoint/IIS)
Note: Static export won't include the API route. You'll need a separate proxy.
```bash
# Add to next.config.ts: output: 'export'
npm run build
# Upload 'out' folder to your server
```

---

## 🗺️ Roadmap

- [ ] **Supabase integration** — user auth, cloud database, multi-device sync
- [ ] **Calendar view** — visual overview of logged days
- [ ] **Weekly summary** — auto-generate weekly reports
- [ ] **Tags & labels** — finer categorization
- [ ] **Jira/Azure DevOps import** — auto-populate from issue trackers
- [ ] **PWA offline support** — service worker for offline use
- [ ] **Dark/light theme toggle**
- [ ] **Team dashboard** — managers view team logs

---

## License

Internal tool — use and modify freely within your organization.
