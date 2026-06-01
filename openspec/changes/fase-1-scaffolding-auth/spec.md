## Spec: fase-1-scaffolding-auth

### Auth System

**Username + PIN Login**

- Given: username field is empty and user taps "Iniciar sesión"
  Then: show validation error "Ingresá tu usuario" below the field
- Given: PIN field is empty and user taps "Iniciar sesión"
  Then: show validation error "Ingresá el PIN de 4 dígitos"
- Given: PIN has fewer than 4 digits and user taps "Iniciar sesión"
  Then: show validation error "El PIN debe tener 4 dígitos"
- Given: user types more than 4 digits in the PIN field
  Then: prevent input beyond 4 characters (maxLength=4, plus HTML validation)
- Given: PIN contains non-numeric characters
  Then: prevent input of non-numeric chars (inputMode="numeric" + pattern)
- Given: valid username and 4-digit PIN are entered and user taps "Iniciar sesión"
  Then: transform username to `{username}@cocinerhosp.internal`
  Then: call `supabase.auth.signInWithPassword({ email, password })` with the transformed email and PIN as password
  Then: on success, show loading state on button, redirect to `/`
  Then: on error (wrong credentials), show "Usuario o PIN incorrecto" in the error area
  Then: on network error, show "Error de conexión. Verificá tu conexión a internet."
- Given: user is already authenticated and navigates to `/login`
  Then: redirect to `/` immediately (no flash of login page)
- Given: session token expires or is invalidated
  Then: auto-redirect to `/login` (via `onAuthStateChange`)
- Given: user is on any protected route and session becomes invalid
  Then: redirect to `/login`, preserve the attempted path for post-login redirect

**Sign Out**

- Given: authenticated user triggers sign out
  Then: call `supabase.auth.signOut()`
  Then: clear local session state
  Then: redirect to `/login`
- Given: sign out fails (network error)
  Then: log the error, still clear local state and redirect to `/login`

**Session Persistence**

- Given: user refreshes the page or opens a new tab
  Then: `supabase.auth.getSession()` retrieves the session from localStorage
  Then: if session is valid, restore authenticated state and stay on current route
  Then: if session is expired/invalid, redirect to `/login`
- Given: user closes and reopens the browser
  Then: same as refresh — session persists via Supabase client in localStorage
- Given: user is on `/login` and session exists (e.g., manually typed URL)
  Then: redirect to `/`

### Routing

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login form |
| `/` | Protected | Calcular page (placeholder for Fase 2) |
| `/blandas` | Protected | Blandas page (placeholder for Fase 3) |
| `/registrar` | Protected | Registrar page (placeholder for Fase 4) |
| `/dashboard` | Protected | Dashboard page (placeholder for Fase 5) |
| `*` (unknown) | Public | Redirect to `/` (or `/login` if not authenticated) |

- Protected routes show a placeholder component: "Pantalla en construcción" with the tab name
- Auth guard wraps all protected routes in a `<ProtectedLayout>` component
- `<ProtectedLayout>` checks session on mount and on every route change
- `<ProtectedLayout>` includes TopBar + BottomNav, renders `<Outlet />` for child routes
- `<ProtectedLayout>` shows a centered spinner/loader while checking session on initial load

### Layout Shell

**TopBar**

- Fixed/sticky at top of viewport (sticky, z-index 100)
- Background color: `#1B5E3F` (accent green, from `colors.ts`)
- Text color: white
- Height: ~48px (padding 14px 16px)
- Left side: `<IconBuildingHospital />` (18px) + "CocinerHosp" (16px, semibold)
- Right side: current date formatted as "Dom 1 jun" using date-fns `format()` (11px, monospace, 75% opacity)
- Date updates on new calendar day — use `useEffect` with interval or on focus
- TopBar is NOT shown on the `/login` page

**BottomNav**

- Fixed at bottom of viewport (sticky bottom, or fixed with padding on main content)
- Background: white
- 4 equal-width tabs using React Router `<NavLink>`
- Each tab: icon (20px) + label (11px), stacked vertically
- Tab order: Calcular (calculator), Blandas (bowl-spoon), Registrar (clipboard-list), Dashboard (chart-bar)
- Active tab: color `#1B5E3F` (accent green) + 2px top border (green)
- Inactive tab: color `#9E9C95` (text3 gray)
- Each tab navigates to its route: `/`, `/blandas`, `/registrar`, `/dashboard`
- Route `/` maps to "Calcular" tab
- Icons from `@tabler/icons-react` (e.g., `IconCalculator`, `IconBowlSpoon`, etc.)

### Login Page

**Layout**

- Full viewport height, centered content
- Background: `#F4F3EF` (bg)
- On mobile (< 640px): content fills width with 24px padding
- On desktop (>= 640px): centered card, max-width 400px

**Content (top to bottom)**

1. App identity: `<IconBuildingHospital />` (36px, green) + "CocinerHosp" (22px, semibold, text color)
2. Subtitle: "Accedé a tu cuenta" (13px, text2 gray)
3. Spacer (~24px)
4. "Usuario" label (11px, text2) + text input
   - Placeholder: "Ej: carlos"
   - autoFocus
   - autoCapitalize="none", autoCorrect="off", spellCheck="false"
5. "PIN" label (11px, text2) + password input
   - inputMode="numeric"
   - maxLength={4}
   - pattern="[0-9]{4}"
   - autoComplete="one-time-code"
6. Error message area (12px, red `#991B1B`) — hidden when no error
7. "Iniciar sesión" button
   - Full width
   - Background: `#1B5E3F` (accent), white text
   - Height: 48px (min 44px touch target)
   - Border radius: 12px
   - Font: 14px, semibold
   - Disabled state while loading (show spinner or "Ingresando...")
   - Disabled state if username or PIN is empty

**States**

| State | Visual |
|-------|--------|
| Default | Empty fields, "Iniciar sesión" enabled (but does nothing if fields empty) |
| Filling | User types, no validation until submit |
| Submitting | Button shows loading state, fields disabled |
| Error | Error message appears below inputs in red, fields re-enabled |
| Success | Redirect to `/` |

### PWA Configuration

- `registerType: 'autoUpdate'` — updates install automatically when detected
- `manifest.json`:
  - name: "CocinerHosp"
  - short_name: "CocinerHosp"
  - description: "Gestión de producción para comedor hospitalario"
  - theme_color: "#1B5E3F"
  - background_color: "#F4F3EF"
  - display: "standalone"
  - orientation: "portrait"
  - start_url: "/"
  - icons: 192x192 and 512x512 PNG
- Workbox globPatterns: `['**/*.{js,css,html,ico,png,svg}']`
- Runtime caching: Supabase API calls (`supabase.co`) with NetworkFirst strategy
- No offline fallback page in this phase (basic PWA setup only)

### Technical Constraints

- TypeScript strict mode enabled in `tsconfig.json`
- No `any` type anywhere — use `unknown` and narrow
- All component props typed with exported interfaces
- All functions have explicit return types
- No `useEffect` for derived state — only for side effects (session listener, date update)
- Colors MUST come from `src/theme/colors.ts`, never hardcoded in JSX
- One component per file, PascalCase naming
- Max 150 lines per component
- `inputMode="numeric"` on PIN field for numeric keypad on mobile
- `env` variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Edge Cases

- **Double submit**: Button disabled while submitting, prevent duplicate auth calls
- **Network timeout**: Show "Error de conexión" if Supabase doesn't respond within 15s
- **Wrong credentials**: Show generic "Usuario o PIN incorrecto" (don't reveal which is wrong)
- **Already authenticated**: Redirect away from `/login` immediately
- **Rate limiting**: Supabase handles rate limiting; show the error message returned
- **Tab visibility**: If user switches tabs during login, maintain loading state
- **Soft keyboard on mobile**: Login form should scroll up when keyboard appears (ensure inputs are visible)
