# Tasks: fase-8-roles-y-control

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~510 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Backend (hooks + RPCs) + Perfil → PR 2: Dashboard filtros + BottomNav dinámico → PR 3: Gestión usuarios admin |
| Delivery strategy | ask-on-risk |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Hooks (cambiarPin, useUsuarios) + Perfil.tsx + AdminRoute | PR 1 | Base = main; foundation para todo lo demás |
| 2 | BottomNav dinámico + TopBar perfil + Dashboard filtros + rutas | PR 2 | Depende de PR 1 (usa roles + hooks) |
| 3 | Usuarios.tsx gestión admin completa | PR 3 | Depende de PR 2 (usa AdminRoute, navegación) |

## Phase 1: Hooks y RPCs

- [x] 1.1 Agregar `cambiarPin(pinActual, pinNuevo)` a `src/hooks/useAuth.ts` — validación 4 dígitos + llamada RPC `cambiar_pin`
- [x] 1.3 Crear `src/hooks/useUsuarios.ts` — hook con `listarUsuarios()`, `crearUsuario()`, `toggleUsuario()`, `cambiarPinAdmin()`

## Phase 2: Navegación y Layout

- [x] 2.1 Modificar `src/components/layout/TopBar.tsx` — agregar ícono perfil que navega a `/perfil`
- [x] 2.2 Modificar `src/components/layout/BottomNav.tsx` — filtrar tabs según `user.rol`; admin ve tab Usuarios extra
- [x] 2.3 Crear `src/components/layout/AdminRoute.tsx` — wrapper que redirige a `/` si rol !== 'admin'
- [x] 2.4 Modificar `src/App.tsx` — agregar rutas `/perfil` y `/usuarios` (con AdminRoute)

## Phase 4: Dashboard con Filtros

- [x] 4.1 Modificar `src/pages/Dashboard.tsx` — si rol es admin o chef_jefe, cargar lista de chefs y mostrar `<select>` arriba del dashboard
- [x] 4.2 Conectar selector de chef con `useDashboard(selectedUserId)` — "Todos" pasa `null`, chef específico pasa su `id`

## Phase 5: Gestión de Usuarios (Admin)

- [x] 5.1 Crear `src/pages/Usuarios.tsx` — tabla/lista de usuarios con nombre, username, rol, centro, estado
- [x] 5.2 Agregar formulario modal/inline "Nuevo usuario" — nombre, username, PIN, rol, centro
- [x] 5.3 Agregar botón activar/desactivar por usuario + botón "Cambiar PIN" admin

## Phase 6: Documentación RPCs SQL

- [x] 6.1 Documentar SQL necesario para RPCs: cambiar_pin, listar_usuarios, crear_usuario, toggle_usuario, cambiar_pin_admin
