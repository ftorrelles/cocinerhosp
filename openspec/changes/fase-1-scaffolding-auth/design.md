## Design: fase-1-scaffolding-auth

### File Structure

```
cocinerhosp/
├── index.html                     ← Head: DM Sans + DM Mono fonts, viewport
├── package.json                   ← Vite + React 18 + deps scripts
├── vite.config.ts                 ← React plugin + VitePWA plugin + Tailwind
├── tsconfig.json                  ← strict: true, paths
├── tailwind.config.ts             ← content paths, theme extensions (colors, fontFamily)
├── postcss.config.js              ← tailwindcss + autoprefixer
├── .env.local                     ← VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── public/
│   └── manifest.json              ← PWA manifest (name, icons, colors, display)
└── src/
    ├── main.tsx                   ← Entry: render App with BrowserRouter
    ├── App.tsx                    ← Auth guard + Layout + Routes
    ├── index.css                  ← Tailwind directives + base styles
    ├── pages/
    │   └── Login.tsx              ← Login form (username + PIN)
    ├── components/
    │   ├── layout/
    │   │   ├── TopBar.tsx         ← App logo + date
    │   │   ├── BottomNav.tsx      ← 4-tab navigation
    │   │   └── ProtectedLayout.tsx ← Auth check + TopBar + BottomNav + Outlet
    │   └── ui/
    │       └── Spinner.tsx        ← Loading spinner (shared)
    ├── lib/
    │   └── supabase.ts            ← Supabase client singleton
    ├── hooks/
    │   └── useAuth.ts             ← Auth state, signIn, signOut
    └── theme/
        └── colors.ts              ← Design tokens from PRD section 6
```

### Component Tree

```
<BrowserRouter>
  <Routes>
    {/* Public route — no layout */}
    <Route path="/login" element={<Login />} />

    {/* Protected routes — wrapped in auth guard + layout */}
    <Route element={<ProtectedLayout />}>
      <Route path="/" element={<PlaceholderPage title="Calcular" />} />
      <Route path="/blandas" element={<PlaceholderPage title="Dietas Blandas" />} />
      <Route path="/registrar" element={<PlaceholderPage title="Registrar" />} />
      <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

### Component Responsibilities

| Component | Responsibility | State | Props |
|-----------|---------------|-------|-------|
| `Login` | Render form, handle validation, call signIn, show errors | username, pin, error, loading | none (self-contained) |
| `TopBar` | Show logo + date | date string (updated via effect) | none |
| `BottomNav` | Show 4 tabs with active state | active route (from useLocation) | none |
| `ProtectedLayout` | Check auth, show spinner while loading, render layout + children | session check | none |
| `Spinner` | Centered loading indicator | none | `size?` |

### Auth Flow

```
┌────────────────────────────────────────────────────────────────┐
│ App mounts                                                     │
│   → supabase.auth.getSession()                                 │
│   → set user + session state                                   │
│   → subscribe to onAuthStateChange                             │
│                                                                │
│ ProtectedLayout renders:                                       │
│   if (loading) → show <Spinner />                              │
│   if (!session) → <Navigate to="/login" />                     │
│   if (session)  → <TopBar /> + <BottomNav /> + <Outlet />      │
│                                                                │
│ Login flow:                                                    │
│   user types username + PIN                                    │
│   → validate (non-empty, PIN is 4 digits)                      │
│   → email = `${username}@cocinerhosp.internal`                 │
│   → supabase.auth.signInWithPassword({ email, password: pin }) │
│   → onAuthStateChange fires → session updated                  │
│   → ProtectedLayout sees session → renders children            │
│   → user redirected to /                                       │
│                                                                │
│ Logout flow:                                                   │
│   supabase.auth.signOut()                                      │
│   → onAuthStateChange fires with null session                  │
│   → ProtectedLayout redirects to /login                        │
└────────────────────────────────────────────────────────────────┘
```

### Key Types

```typescript
// src/theme/colors.ts
export const colors = {
  bg:           '#F4F3EF',
  surface:      '#FFFFFF',
  surface2:     '#EEEDE8',
  border:       '#D9D7CF',
  text:         '#1A1917',
  text2:        '#6B6860',
  text3:        '#9E9C95',
  accent:       '#1B5E3F',
  accentLight:  '#E8F3ED',
  accent2:      '#1E3A5F',
  accent2Light: '#EFF6FF',
  warn:         '#B45309',
  warnLight:    '#FEF3C7',
  red:          '#991B1B',
  redLight:     '#FEE2E2',
  fontSans:     "'DM Sans', sans-serif",
  fontMono:     "'DM Mono', monospace",
} as const
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```typescript
// src/hooks/useAuth.ts
import { User, Session } from '@supabase/supabase-js'

interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (username: string, pin: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  // State: user, session, loading
  // Effect: getSession() on mount, onAuthStateChange subscription
  // Cleanup: unsubscribe on unmount
  // signIn: validate → transform email → supabase.auth.signInWithPassword
  // signOut: supabase.auth.signOut
}
```

```typescript
// src/components/ui/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}
```

```typescript
// src/pages/Login.tsx
// Internal state (useState):
//   username: string
//   pin: string
//   error: string | null
//   loading: boolean
```

### Tailwind Config

```typescript
// tailwind.config.ts — theme extension
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Map to match src/theme/colors.ts values
        // Or use CSS custom properties approach
        bg: '#F4F3EF',
        surface: '#FFFFFF',
        surface2: '#EEEDE8',
        border: '#D9D7CF',
        text: '#1A1917',
        text2: '#6B6860',
        text3: '#9E9C95',
        accent: '#1B5E3F',
        'accent-light': '#E8F3ED',
        accent2: '#1E3A5F',
        'accent2-light': '#EFF6FF',
        warn: '#B45309',
        'warn-light': '#FEF3C7',
        red: '#991B1B',
        'red-light': '#FEE2E2',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
}
```

### PWA Config (vite.config.ts extract)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'CocinerHosp',
    short_name: 'CocinerHosp',
    description: 'Gestión de producción para comedor hospitalario',
    theme_color: '#1B5E3F',
    background_color: '#F4F3EF',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [{
      urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'supabase-cache' },
    }],
  },
})
```

### Implementation Order

Each numbered step is a verifiable unit:

| # | Step | Verify |
|---|------|--------|
| 1 | `npm create vite@latest cocinerhosp -- --template react-ts` | `npm run dev` starts |
| 2 | Install deps: `npm install react-router-dom zustand @supabase/supabase-js @tabler/icons-react date-fns` + `npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer` | package.json updated |
| 3 | Configure `tailwind.config.ts` + `postcss.config.js` + `vite.config.ts` (tailwind plugin) | Tailwind classes work |
| 4 | Create `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`) | Styles applied |
| 5 | Create `src/theme/colors.ts` | Import works in components |
| 6 | Update `index.html` head: fonts, viewport, title | HTML renders correctly |
| 7 | Create `src/lib/supabase.ts` | Import works, no TS errors |
| 8 | Create `src/hooks/useAuth.ts` | Hook compiles cleanly |
| 9 | Create `public/manifest.json` | PWA manifest valid |
| 10 | Update `vite.config.ts` with VitePWA plugin | Build includes SW |
| 11 | Create `src/pages/Login.tsx` | TS compiles, UI renders |
| 12 | Create `src/components/ui/Spinner.tsx` | Reusable spinner renders |
| 13 | Create `src/components/layout/TopBar.tsx` | TS compiles cleanly |
| 14 | Create `src/components/layout/BottomNav.tsx` | TS compiles cleanly |
| 15 | Create `src/components/layout/ProtectedLayout.tsx` | Auth guard works |
| 16 | Create `src/App.tsx` with routes | All routes render correctly |
| 17 | Update `src/main.tsx` with BrowserRouter | App renders without errors |
| 18 | Create `.env.local` with placeholder values | Supabase client initializes |
| 19 | Run `npx tsc --noEmit` — zero errors | All types pass |

### Dependencies

```
react@18, react-dom@18
react-router-dom@6
zustand@4
@supabase/supabase-js@2
@tabler/icons-react
date-fns
---
vite@5
@vitejs/plugin-react
typescript@5 (strict)
tailwindcss@3
@tailwindcss/vite
postcss
autoprefixer
vite-plugin-pwa
```

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| No Supabase credentials available | Login won't work | Use env vars, document setup, show clear error if missing |
| `username@cocinerhosp.internal` email format conflicts with real accounts | Naming collision risk | Use `.internal` TLD — not routable on public internet. Ensure uniqueness constraint on username at signup |
| Tabler Icons import tree-shaking not working | Bundle size | Verify build output, use individual imports not barrel |
| PWA icons missing | Browser console warnings | Create placeholder 192x192 and 512x512 SVG/PNG icons |
| Session flash on page refresh | UX flicker | Show Spinner in ProtectedLayout while `loading` is true |
