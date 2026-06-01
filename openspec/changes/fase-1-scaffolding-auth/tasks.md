## Tasks: fase-1-scaffolding-auth

### Review Workload Forecast

- **Estimated changed lines**: ~350-450 (new project creation + 19 steps)
- **Files created**: ~18 files (config, components, pages, hooks, lib, theme, public)
- **Chained PRs recommended**: No (single PR is fine for scaffolding)
- **400-line budget risk**: Borderline — scaffold template and configs add noise
- **Decision needed before apply**: Ask user if lines exceed 400

### Task List

Each task is a verifiable unit of work. Tasks can be done sequentially or in parallel where noted.

---

#### T1: Scaffold Vite + React + TypeScript project

**Depends on**: Nothing
**Files affected**: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx` (auto-generated)

**Steps**:
1. Run `npm create vite@latest cocinerhosp -- --template react-ts` from parent directory, or manually create files
2. Verify `package.json` has react@18, react-dom@18, typescript@5
3. Set `"strict": true` in `tsconfig.json`
4. Add `src/` structure directories: `pages/`, `components/layout/`, `components/ui/`, `lib/`, `hooks/`, `theme/`
5. Run `npm install` and `npx tsc --noEmit` — zero errors

**Acceptance**: `npm run dev` starts, TypeScript compiles with strict mode, no errors.

---

#### T2: Install all dependencies

**Depends on**: T1
**Files affected**: `package.json`

**Steps**:
1. `npm install react-router-dom zustand @supabase/supabase-js @tabler/icons-react date-fns`
2. `npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer vite-plugin-pwa`

**Acceptance**: All packages in `package.json`, no peer dependency warnings.

---

#### T3: Configure Tailwind CSS + PostCSS

**Depends on**: T2
**Files affected**: `tailwind.config.ts`, `postcss.config.js`, `vite.config.ts`, `src/index.css`

**Steps**:
1. Create `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins
2. Create `tailwind.config.ts` with:
   - `content: ['./index.html', './src/**/*.{ts,tsx}']`
   - Theme extensions: custom colors map, fontFamily (DM Sans, DM Mono), borderRadius
3. Update `vite.config.ts` — add `tailwindcss()` plugin
4. Create `src/index.css` with `@tailwind base/components/utilities`
5. Import `index.css` in `src/main.tsx`

**Acceptance**: A `<div className="bg-accent text-white">` renders with green background and white text.

---

#### T4: Create design tokens (src/theme/colors.ts)

**Depends on**: T1
**Files affected**: `src/theme/colors.ts`

**Steps**:
1. Create `src/theme/colors.ts` with the full palette from PRD section 6
2. Export as `const` object with `as const` assertion
3. All 16 tokens: bg, surface, surface2, border, text, text2, text3, accent, accentLight, accent2, accent2Light, warn, warnLight, red, redLight, plus fontSans, fontMono

**Acceptance**: `import { colors } from '../theme/colors'` compiles and returns correct hex values.

---

#### T5: Update index.html (fonts + viewport)

**Depends on**: T1
**Files affected**: `index.html`

**Steps**:
1. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `https://fonts.gstatic.com`
2. Add DM Sans (+400, +500, +600) and DM Mono (+400, +500) Google Fonts link
3. Set viewport with `maximum-scale=1.0` (prevent zoom on input focus on iOS)
4. Set `<title>CocinerHosp — Producción</title>`

**Acceptance**: Page loads with DM Sans font, viewport locks scale on mobile.

---

#### T6: Create Supabase client singleton

**Depends on**: T2
**Files affected**: `src/lib/supabase.ts`, `.env.local`

**Steps**:
1. Create `.env.local` with placeholder vars:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
2. Create `src/lib/supabase.ts`:
   - Import `createClient` from `@supabase/supabase-js`
   - Read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`
   - Export `supabase` singleton
   - Add check: if env vars are missing, log warning and throw

**Acceptance**: `import { supabase } from '../lib/supabase'` compiles, client initializes (warns if no env vars).

---

#### T7: Create useAuth hook

**Depends on**: T6
**Files affected**: `src/hooks/useAuth.ts`

**Steps**:
1. Create `src/hooks/useAuth.ts`:
   - State: `user: User | null`, `session: Session | null`, `loading: boolean`
   - On mount: call `supabase.auth.getSession()`, set state
   - Subscribe to `supabase.auth.onAuthStateChange` — update user/session on changes
   - `signIn(username, pin)`: validate inputs, transform email to `{username}@cocinerhosp.internal`, call `supabase.auth.signInWithPassword`, return `{ error?: string }`
   - `signOut()`: call `supabase.auth.signOut()`, clear state
   - Cleanup: unsubscribe on unmount
2. Export as typed function with `UseAuthReturn` interface

**Acceptance**: Hook returns correct user/session state, signIn calls Supabase with transformed email, signOut clears state.

---

#### T8: Create Login page

**Depends on**: T7
**Files affected**: `src/pages/Login.tsx`

**Steps**:
1. Create `src/pages/Login.tsx`:
   - Full-screen centered layout with `bg-[#F4F3EF]`
   - App identity: building-hospital icon + "CocinerHosp" heading
   - Subtitle: "Accedé a tu cuenta"
   - "Usuario" text input: placeholder "Ej: carlos", autoFocus
   - "PIN" password input: `inputMode="numeric"`, `maxLength={4}`, `pattern="[0-9]{4}"`
   - "Iniciar sesión" button: full width, 48px height, accent green bg
   - Error message area (hidden by default, red text)
   - Loading state: button shows "Ingresando..." or spinner, fields disabled
   - Validation: empty username → "Ingresá tu usuario", empty/short PIN → "El PIN debe tener 4 dígitos"
   - On submit: call `signIn`, handle error or success (redirect via React Router)
2. Redirect to `/` if already authenticated (via `useAuth` session check)

**Acceptance**: Form renders, validates input, calls auth, shows errors, redirects on success. TS compiles with no `any`.

---

#### T9: Create UI primitives (Spinner)

**Depends on**: T1
**Files affected**: `src/components/ui/Spinner.tsx`

**Steps**:
1. Create `Spinner.tsx`:
   - Centered spinning circle using Tailwind `animate-spin`
   - Props: `size?: 'sm' | 'md' | 'lg'` mapping to w/h: 16/24/36px
   - Default color: accent green

**Acceptance**: `<Spinner size="md" />` renders centered animated spinner.

---

#### T10: Create TopBar component

**Depends on**: T4
**Files affected**: `src/components/layout/TopBar.tsx`

**Steps**:
1. Create `TopBar.tsx`:
   - Sticky top bar with background `#1B5E3F`
   - Left: `<IconBuildingHospital />` (18px) + "CocinerHosp" text (16px, semibold, white)
   - Right: current date formatted with date-fns `format()` (11px, DM Mono, 75% opacity)
   - Date format: "Dom 1 jun" (abbreviated day + date + abbreviated month, in Spanish)
   - Update date on new day: use `useEffect` with interval or on visibility change
   - Padding: 14px 16px, height ~48px

**Acceptance**: TopBar renders with correct styling and live date. No date flash.

---

#### T11: Create BottomNav component

**Depends on**: T4
**Files affected**: `src/components/layout/BottomNav.tsx`

**Steps**:
1. Create `BottomNav.tsx`:
   - 4 tabs using React Router `<NavLink>`
   - Tabs: Calcular (`/`), Blandas (`/blandas`), Registrar (`/registrar`), Dashboard (`/dashboard`)
   - Each tab: Tabler icon (20px) + label (11px) stacked
   - Active tab: green `#1B5E3F` + 2px top border (green)
   - Inactive tab: gray `#9E9C95`
   - White background, grid layout with 4 equal columns
   - Padding: 10px 4px 8px per tab

**Acceptance**: 4 tabs render, active tab matches current route, navigation works between routes.

---

#### T12: Create ProtectedLayout component

**Depends on**: T7, T10, T11, T9
**Files affected**: `src/components/layout/ProtectedLayout.tsx`

**Steps**:
1. Create `ProtectedLayout.tsx`:
   - Use `useAuth()` to get session + loading state
   - If `loading`: render `<Spinner size="lg" />` centered
   - If `!session`: render `<Navigate to="/login" replace />`
   - If `session`: render `<TopBar />` + `<BottomNav />` + `<Outlet />` (from react-router-dom)
   - Content area between TopBar and BottomNav has bottom padding to account for BottomNav height

**Acceptance**: Authenticated users see layout with TopBar + BottomNav + page content. Unauthenticated users are redirected to /login.

---

#### T13: Create App.tsx with Router + Auth guard

**Depends on**: T8, T12
**Files affected**: `src/App.tsx`

**Steps**:
1. Create `src/App.tsx`:
   - Import `BrowserRouter`, `Routes`, `Route`, `Navigate` from react-router-dom
   - Public route: `<Route path="/login" element={<Login />} />`
   - Protected routes wrapper: `<Route element={<ProtectedLayout />}>`
   - Protected children (placeholder pages for now):
     - `/` → "Calcular" placeholder
     - `/blandas` → "Dietas Blandas" placeholder
     - `/registrar` → "Registrar" placeholder
     - `/dashboard` → "Dashboard" placeholder
   - Catch-all: `<Route path="*" element={<Navigate to="/" replace />} />`
2. Create placeholder pages inline or as simple components showing "Pantalla en construcción" with tab name

**Acceptance**: Navigation works between all routes, auth guard redirects to login, login redirects to home on success.

---

#### T14: Update main.tsx entry point

**Depends on**: T13, T5
**Files affected**: `src/main.tsx`

**Steps**:
1. Update `src/main.tsx`:
   - Import `BrowserRouter` from react-router-dom
   - Wrap `<App />` with `<BrowserRouter>`
   - Import `./index.css` for Tailwind styles

**Acceptance**: App renders in browser without errors.

---

#### T15: Configure PWA (vite-plugin-pwa + manifest)

**Depends on**: T2
**Files affected**: `vite.config.ts`, `public/manifest.json`, `public/icons/`

**Steps**:
1. Create `public/manifest.json` with PRD section 9 values
2. Create `public/icons/` directory with placeholder PNG files (192x192 and 512x512) — use simple colored square SVGs converted to PNG, or link to placeholder icons
3. Update `vite.config.ts`:
   - Import `VitePWA` from `vite-plugin-pwa`
   - Add to plugins with manifest config and workbox settings (autoUpdate, NetworkFirst for supabase.co)

**Acceptance**: `npm run build` generates service worker and manifest in dist/. PWA installable from browser.

---

#### T16: Verify with TypeScript compiler

**Depends on**: All previous tasks
**Files affected**: None (verification step)

**Steps**:
1. Run `npx tsc --noEmit`
2. Fix any type errors
3. Verify no `any` types used
4. Verify strict mode is enforced

**Acceptance**: Zero TypeScript errors, clean compilation.

---

### Parallelization Map

```
T1 ──┬── T2 ──┬── T3
     │        └── T15 (PWA)
     │
     ├── T4 (colors)
     ├── T5 (index.html)
     └── T9 (Spinner)

T6 (Supabase) ── T7 (useAuth) ── T8 (Login)
                               └── T12 (ProtectedLayout)
T3 ── T10 (TopBar)
T3 ── T11 (BottomNav)

T8 + T12 + T10 + T11 ── T13 (App.tsx) ── T14 (main.tsx) ── T16 (verify)
```

**Serial chain**: T1 → T2 → T3 → T6 → T7 → T8 → T13 → T14 → T16
**Parallel independent**: T4, T5, T9 (can start after T1)
**Parallel after T3**: T10, T11, T15 (can start after T3)
**Parallel after T7**: T12 (starts after T7, runs alongside T8)
