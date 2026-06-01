## Proposal: fase-1-scaffolding-auth

### Intent

Inicializar el proyecto CocinerHosp desde cero: crear el scaffolding de Vite + React 18 + TypeScript strict, configurar Tailwind CSS con los design tokens del PRD, conectar Supabase (auth + cliente), implementar login con username + PIN, armar el layout shell con TopBar y BottomNav, configurar React Router v6 con auth guard, y dejar la PWA lista con vite-plugin-pwa. Esta fase establece la base arquitectónica sobre la que se construirá el resto de la app.

### Scope

**In scope:**

1. **Scaffolding**: Proyecto Vite + React 18 + TypeScript (`strict: true`)
2. **Dependencias**: Tailwind CSS, PostCSS, React Router v6, Zustand, Supabase JS client, Tabler Icons, vite-plugin-pwa, date-fns
3. **Tailwind config**: `tailwind.config.ts` con content paths, `postcss.config.js`, import de `@tailwind base/components/utilities` en CSS
4. **Design tokens**: `src/theme/colors.ts` — paleta completa del PRD sección 6
5. **Supabase client**: `src/lib/supabase.ts` — singleton con `createClient`
6. **Auth hook**: `src/hooks/useAuth.ts` — signIn, signOut, session state, user state
7. **Login page**: `src/pages/Login.tsx` — formulario con campo `username` (texto) + campo `PIN` (password, 4 dígitos, `inputMode="numeric"`)
8. **TopBar**: `src/components/layout/TopBar.tsx` — logo "CocinerHosp" + ícono + fecha actual con date-fns
9. **BottomNav**: `src/components/layout/BottomNav.tsx` — 4 tabs con Tabler Icons: Calcular, Blandas, Registrar, Dashboard
10. **Router + Auth guard**: `src/App.tsx` con React Router v6 — ruta pública `/login`, rutas protegidas `/`, `/blandas`, `/registrar`, `/dashboard` con redirect a `/login` si no hay sesión
11. **PWA**: `vite.config.ts` con `VitePWA` plugin, `public/manifest.json`, Service Worker auto-register
12. **Entry point**: `src/main.tsx` con `BrowserRouter`

**Out of scope:**
- Pantalla Calcular (Fase 2)
- Pantalla Dietas Blandas (Fase 3)
- Pantalla Registrar (Fase 4)
- Pantalla Dashboard (Fase 5)
- Lógica de cálculo (`calculos.ts`)
- Store de Zustand para platos/resultados
- Tabla de usuarios en Supabase (seed data)
- RLS policies

### Approach

**Scaffolding secuencial** — cada capa se agrega sobre la anterior, verificando TypeScript compilation en cada paso.

1. Crear proyecto con `npm create vite@latest cocinerhosp -- --template react-ts`
2. Instalar dependencias: `npm install react-router-dom zustand @supabase/supabase-js @tabler/icons-react date-fns` + `npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`
3. Una a una: configurar Tailwind → theme/colors → Supabase client → useAuth → Login → TopBar → BottomNav → App con router → main.tsx → PWA config
4. Verificar con `npx tsc --noEmit` al final de cada paso

### Key Decisions

1. **Auth strategy**: El username ingresado se transforma internamente a `{username}@cocinerhosp.internal` como email para Supabase Auth. El PIN de 4 dígitos se usa como password. Supabase Auth lo maneja como email+password estándar. La UI solo expone username (texto) + PIN (password, 4 dígitos, `inputMode="numeric"`). El manejo de sesión usa `supabase.auth.onAuthStateChange`.

2. **BottomNav como tabs nativas**: Se usa React Router v6 con `<NavLink>` y estilos Tailwind, no una librería de tabs externa. Los íconos vienen de `@tabler/icons-react`.

3. **Espaciado mobile-first**: Target 390px viewport. Todos los botones de acción mín. 44px de alto. Fuente base 14px.

4. **Colores por servicio**: Almuerzo = verde `#1B5E3F`, Cena = azul `#1E3A5F`. El auth guard no tiene color de servicio (es neutral). Los colores de servicio se aplican desde el store global en fases posteriores.

5. **PWA register mode**: `autoUpdate` — la app se actualiza silenciosamente cuando hay cambios.

### Risks

- **Credenciales Supabase faltantes**: Se necesitan `VITE_SUBABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`. Sin ellas, el login falla. Usar placeholders y documentar.
- **Login con username+PIN vía Supabase Auth**: La transformación a `username@cocinerhosp.internal` funciona, pero hay que asegurar que el signup también use este formato. El flujo de "olvidé mi PIN" no aplica (es local, el supervisor lo resetea).
- **Sin test runner**: Strict TDD deshabilitado. Se habilita cuando se instale vitest (Fase 2+).
- **Sin íconos PWA reales**: Se necesitan íconos 192x192 y 512x512. Usar SVG inline o placeholder.
- **La pantalla de login no está en PROTOTYPE.html**: El diseño debe ser consistente con el prototipo pero no hay referencia directa.

### Spec dependency

La spec debe definir:
- Comportamiento exacto del login (username vacío, PIN de menos/más de 4 dígitos, error de credenciales, sesión expirada)
- Routing: qué pasa si el usuario vuelve a `/login` estando autenticado (redirect a `/`)
- BottomNav: mostrar qué tab está activa basado en la ruta actual
- TopBar: qué información mostrar cuando el usuario está autenticado (nombre de usuario)
- PWA: comportamiento offline inicial (solo mostrar "sin conexión" si no hay cache)
