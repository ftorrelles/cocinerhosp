## Exploration: fase-8-roles-y-control

### Current State

**Autenticación (useAuth.ts)**:
- Login con username + PIN de 4 dígitos vía bcryptjs + RPC `verificar_usuario`
- La RPC devuelve fila con `id`, `username`, `nombre_completo`, `pin_hash`, `rol`
- Sesión persiste en localStorage con clave `cocinerhosp_session` como JSON con `id`, `username`, `nombre_completo`, `rol`
- El campo `rol` ya se guarda en la sesión pero NO se usa para control de acceso en UI
- bcryptjs ya está instalado como dependencia

**Store (useAppStore.ts)**:
- `UserSession` interface ya tiene campo `rol`
- `setUser()` ya recibe y guarda el rol
- user se usa para mostrar nombre en TopBar

**Dashboard (useDashboard.ts + Dashboard.tsx)**:
- `useDashboard(usuarioId, mes?)` — acepta `usuarioId: string | undefined`
- La RPC `obtener_dashboard` acepta `p_usuario_id: null` para traer todos los registros
- Dashboard.tsx pasa `user?.id` a useDashboard — solo ve datos propios
- No hay selector de chef en la UI

**Layout (ProtectedLayout.tsx)**:
- Wraps rutas protegidas con TopBar + BottomNav + Outlet
- No hay lógica de roles para mostrar/ocultar elementos

**TopBar.tsx**:
- Muestra logo, nombre de usuario, fecha, botón de logout
- No tiene ícono de perfil ni acceso a configuración

**BottomNav.tsx**:
- 4 tabs fijas: Calcular, Blandas, Registrar, Dashboard
- Sin condicionales por rol

**App.tsx (Routing)**:
- `/login` (público)
- `/` (Calcular), `/blandas`, `/registrar`, `/dashboard` (protegidas)
- No existe `/perfil` ni `/usuarios`

**package.json**:
- bcryptjs, @supabase/supabase-js, zustand, react-router-dom, @tabler/icons-react, date-fns ya instalados

### Affected Areas

- `src/hooks/useAuth.ts` — agregar función `cambiarPin()` y exponer rol
- `src/hooks/useDashboard.ts` — ya acepta usuarioId null (sin cambios)
- `src/components/layout/TopBar.tsx` — agregar ícono de perfil/engranaje
- `src/components/layout/BottomNav.tsx` — tabs condicionales por rol
- `src/components/layout/ProtectedLayout.tsx` — pasar rol a BottomNav
- `src/App.tsx` — agregar rutas `/perfil` y `/usuarios`
- `src/pages/Dashboard.tsx` — agregar selector de chef para admin/chef_jefe
- `src/pages/Perfil.tsx` — NUEVA: cambio de PIN
- `src/pages/Usuarios.tsx` — NUEVA: gestión de usuarios (solo admin)
- `src/hooks/useUsuarios.ts` — NUEVO: hooks para CRUD de usuarios vía RPCs
- `supabase/migrations/` — SQL para RPCs: cambiar_pin, listar_usuarios, crear_usuario, toggle_usuario, cambiar_pin_admin

### Approaches

**1. Estrategia de navegación según rol**

- **Opción A: BottomNav dinámico** — BottomNav recibe el rol y renderiza distintos tabs. Admin ve 5 tabs (+ Usuarios), chef/chef_jefe ven 4 + el ícono de perfil en TopBar.
  - Pros: Simple, consistente con patrón actual, sin routing complejo
  - Cons: BottomNav necesita saber el rol
  - Effort: Bajo

- **Opción B: Menú de usuario en TopBar** — TopBar tiene un menú desplegable con opciones según rol (Perfil, Usuarios si admin).
  - Pros: Centraliza acceso a configuración
  - Cons: Más clicks para llegar, menos discoverable en mobile
  - Effort: Medio

**Recomendación**: Opción A — BottomNav dinámico + ícono de perfil en TopBar. Es lo más mobile-friendly y consistente con el diseño actual.

**2. Implementación de selector de chef en Dashboard**

- **Opción A: Select nativo HTML** — `<select>` con opciones "Todos" + lista de chefs. onChange recarga datos.
  - Pros: Simple, accesible, nativo mobile-friendly
  - Cons: Menos control de estilo
  - Effort: Bajo

- **Opción B: Dropdown personalizado** — Componente dropdown con estilo Tailwind.
  - Pros: Control total de diseño
  - Cons: Más código, posible problema de accesibilidad
  - Effort: Medio

**Recomendación**: Opción A — select nativo con estilo Tailwind. Es mobile-first y lo que necesitan los chefs.

**3. Implementación de cambio de PIN**

- **Opción A: useAuth con función cambiarPin** — Agregar `cambiarPin(pinActual, pinNuevo)` a useAuth que llama RPC `cambiar_pin` en Supabase.
  - Pros: Reusa bcryptjs, consistente con patrón existente
  - Cons: La RPC debe verificar el PIN actual del lado del servidor
  - Effort: Bajo

**Recomendación**: Opción A — lógica de cambio de PIN en useAuth, misma RPC pattern que signIn.

**4. Implementación de gestión de usuarios (admin)**

- **Opción A: Página standalone con hooks** — `useUsuarios.ts` hook con funciones listar, crear, toggle, cambiarPinAdmin. Cada función llama su RPC.
  - Pros: Separación clara, reutilizable, testeable
  - Cons: Múltiples RPCs
  - Effort: Medio

**Recomendación**: Opción A — hook useUsuarios separado con funciones para cada RPC.

### Recommendation

**Approach combinado:**
1. BottomNav dinámico según rol + ícono de perfil en TopBar
2. Select nativo de chef en Dashboard para admin/chef_jefe
3. Cambio de PIN via RPC en useAuth
4. Hook useUsuarios separado para gestión de admin
5. Store: UserSession.rol ya está — solo falta condicionar UI

### Risks

- **Datos de prueba**: Necesitamos crear usuarios de prueba en Supabase con distintos roles para verificar
- **RPCs de Supabase**: Las RPCs cambiar_pin, listar_usuarios, crear_usuario, toggle_usuario, cambiar_pin_admin deben existir en Supabase — podrían no estar creadas aún
- **bcryptjs en el servidor**: La validación del PIN actual en cambiar_pin RPC necesita bcryptjs del lado servidor (PostgreSQL con pgcrypto o plv8)
- **Seguridad**: cambiar_pin_admin permite cambiar PIN sin verificar el actual — riesgo si alguien obtiene acceso admin
- **Sin test runner configurado**: No hay vitest configurado según openspec/config.yaml

### Ready for Proposal

Yes
