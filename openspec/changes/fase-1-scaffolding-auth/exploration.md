## Exploration: fase-1-scaffolding-auth

### Current State

El proyecto **no está scaffolded** — no existe `package.json`, `src/`, ni ningún archivo de código. El directorio contiene solo:
- `PRD.md` — documento de requisitos completo (628 líneas)
- `AGENTS.md` — reglas de desarrollo para agentes AI
- `PROTOTYPE.html` — prototipo funcional HTML/JS con toda la UI y lógica de cálculo
- `PROMPT_INICIAL.md`, `README.md`
- `.atl/skill-registry.md` — índice de skills
- `openspec/` — recién creado por SDD init

### Requirements Summary (del PRD sección 11 — Fase 1)

1. **Scaffolding**: Proyecto Vite + React 18 + TypeScript strict
2. **Tailwind CSS**: Configurar con design tokens (`src/theme/colors.ts`) — paleta completa del PRD sección 6
3. **Supabase**: Cliente singleton en `src/lib/supabase.ts`
4. **Autenticación**: Login con username corto + PIN de 4 dígitos (PRD sección 2)
   - Supabase Auth con hashing de PIN
   - Sesión persistente vía Supabase client
5. **Layout shell**: 
   - `TopBar` con logo "CocinerHosp", ícono, fecha actual
   - `BottomNav` con 4 tabs: Calcular, Blandas, Registrar, Dashboard
   - Colores: verde `#1B5E3F` para almuerzo, azul `#1E3A5F` para cena
6. **Routing**: React Router v6 con:
   - Ruta pública: `/login`
   - Rutas protegidas: `/`, `/blandas`, `/registrar`, `/dashboard`
   - Auth guard que redirige a `/login` si no hay sesión
7. **PWA base**: `vite-plugin-pwa` con manifest (PRD sección 9)

### Affected Areas

```
cocinerhosp/                    ← Nuevo (creado por Vite)
├── index.html                  ← Editado (tipografía DM Sans/Mono, viewport)
├── vite.config.ts              ← Creado (React, PWA plugin, Tailwind)
├── tsconfig.json               ← Configurado (strict: true)
├── tailwind.config.ts          ← Creado (design tokens como CSS vars)
├── postcss.config.js           ← Creado (autoprefixer + tailwind)
├── .env.local                  ← Creado (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── public/
│   ├── manifest.json           ← Creado (PWA manifest)
│   └── icons/                  ← Creado (192x192, 512x512)
├── src/
│   ├── main.tsx                ← Creado (entry point, router)
│   ├── App.tsx                  ← Creado (auth guard + layout)
│   ├── pages/
│   │   └── Login.tsx           ← Creado (username + PIN)
│   ├── components/
│   │   └── layout/
│   │       ├── TopBar.tsx      ← Creado (logo + fecha)
│   │       └── BottomNav.tsx   ← Creado (4 tabs con íconos)
│   ├── lib/
│   │   └── supabase.ts         ← Creado (cliente singleton)
│   ├── hooks/
│   │   └── useAuth.ts          ← Creado (login, logout, session)
│   └── theme/
│       └── colors.ts           ← Creado (design tokens del PRD)
└── openspec/
    └── config.yaml             ← Ya existe
```

### Approaches

1. **Scaffolding secuencial (recomendado)** — Crear proyecto con Vite, luego agregar capas incrementalmente
   - Pros: Orden natural, cada paso es verificable, TypeScript strict desde el inicio
   - Cons: El proyecto no se puede visualizar hasta tener varios archivos
   - Effort: Medio

2. **Componentes primero desde el prototipo** — Extraer componentes del PROTOTYPE.html y luego conectar auth
   - Pros: Visualización rápida de la UI
   - Cons: El login no está en el prototipo (hay que diseñarlo aparte), el routing necesita auth primero, y no hay datos mock sin la estructura de store
   - Effort: Alto (más refactor después)

3. **Template + configuración en paralelo** — Usar template de Vite React TS, configurar Tailwind y Supabase de una
   - Pros: Rápido de bootstrapear
   - Cons: Difícil de verificar cada pieza, mezcla responsabilidades
   - Effort: Medio

### Recommendation

**Approach 1: Scaffolding secuencial**. El orden recomendado de implementación:

1. `npm create vite@latest` con template React + TypeScript
2. Instalar dependencias: Tailwind, PostCSS, React Router, Zustand, Supabase, vite-plugin-pwa, Tabler Icons
3. Configurar Tailwind con `tailwind.config.ts` y design tokens en `src/theme/colors.ts`
4. Configurar PWA con `vite-plugin-pwa` en `vite.config.ts`
5. Crear `src/lib/supabase.ts` — cliente singleton
6. Crear `src/hooks/useAuth.ts` — login con username + PIN, session management
7. Crear `src/pages/Login.tsx` — formulario de login (username + PIN de 4 dígitos)
8. Crear `src/components/layout/TopBar.tsx` — logo + fecha
9. Crear `src/components/layout/BottomNav.tsx` — 4 tabs con Tabler Icons
10. Crear `src/App.tsx` — auth guard con React Router v6
11. Crear `src/main.tsx` — entry point con BrowserRouter

### Risks

- **Sin credenciales de Supabase**: El `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son necesarios para que funcione el login. Habrá que pedírselos al usuario o usar valores placeholder.
- **PIN de 4 dígitos vs Supabase Auth**: Supabase Auth espera email+password por defecto. El login con username+PIN requiere una estrategia: usar el username como email (con un dominio interno tipo `username@cocinerhosp.local`) o almacenar un hash del PIN en una tabla custom y validar contra la base de datos.
- **Sin test runner configurado**: Strict TDD está deshabilitado hasta que se instale vitest y se configure.
- **Sin íconos reales para PWA**: Los íconos 192x192 y 512x512 necesitan ser creados o usaremos placeholders.
- **PROTOTYPE.html no incluye login**: La pantalla de login hay que diseñarla desde cero (consistente con el diseño del prototipo).

### Ready for Proposal

Yes
