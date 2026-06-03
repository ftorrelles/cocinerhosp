# Proposal: fase-8-roles-y-control

## Intent

Agregar sistema de roles (admin, chef_jefe, chef) con control de acceso a funcionalidades, cambio de PIN desde la app, filtros de dashboard por chef, y gestión de usuarios para admin. El campo `rol` ya existe en la tabla usuarios y en la sesión pero no se utiliza —esta fase lo activa.

## Scope

### In Scope

1. **Roles**: 3 roles funcionales: `admin`, `chef_jefe`, `chef` — navegación condicional según rol
2. **Cambio de PIN**: Pantalla `/perfil` con cambio de PIN para cualquier rol autenticado
3. **Dashboard con filtros**: Selector de chef para admin y chef_jefe (usa `p_usuario_id: null` ya soportado)
4. **Gestión de usuarios**: Pantalla `/usuarios` solo admin — CRUD de usuarios (listar, crear, activar/desactivar, cambiar PIN)
5. **RPCs Supabase**: `cambiar_pin`, `listar_usuarios`, `crear_usuario`, `toggle_usuario`, `cambiar_pin_admin`
6. **Navegación según rol**: BottomNav dinámico + ícono perfil en TopBar

### Out of Scope

- RLS policies avanzadas (el sistema usa RPCs, no queries directas)
- Historial de cambios de PIN o auditoría
- Roles dinámicos (no editables desde UI por ahora)
- Layouts responsive para desktop (solo mobile-first)

## Capabilities

### New Capabilities
- `gestion-usuarios`: CRUD de usuarios para admin (listar, crear, activar/desactivar, cambiar PIN)
- `cambio-pin`: Cambio de PIN desde la app para cualquier rol autenticado
- `control-roles`: Navegación y acceso condicional según rol del usuario

### Modified Capabilities
- `dashboard-metricas`: Agregar filtro por chef condicional según rol

## Approach

1. **Auth**: Agregar `cambiarPin()` a `useAuth.ts` — llama RPC `cambiar_pin` con pin actual (verificado con bcryptjs en servidor)
2. **BottomNav**: Recibe `rol` vía store, renderiza tabs condicionales (admin ve tab "Usuarios" extra)
3. **TopBar**: Agregar botón de engranaje/perfil que navega a `/perfil`
4. **Dashboard.tsx**: Si rol es admin/chef_jefe, mostrar `<select>` con opciones "Todos" + lista chefs. Cambiar `usuarioId` según selección
5. **Admin page**: `/usuarios` con lista + formulario modal para crear usuario. Hook `useUsuarios.ts` para RPCs
6. **ProtectedLayout**: No cambia estructuralmente — la lógica de roles se maneja desde los componentes

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Modified | Agregar `cambiarPin()` |
| `src/hooks/useUsuarios.ts` | New | Hook para RPCs de admin |
| `src/components/layout/TopBar.tsx` | Modified | Botón perfil/engranaje |
| `src/components/layout/BottomNav.tsx` | Modified | Tabs según rol |
| `src/App.tsx` | Modified | Rutas `/perfil` y `/usuarios` |
| `src/pages/Perfil.tsx` | New | Cambio de PIN |
| `src/pages/Usuarios.tsx` | New | Gestión de usuarios (admin) |
| `src/pages/Dashboard.tsx` | Modified | Selector de chef |
| `supabase/rpcs/` | New | SQL para RPCs |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RPCs no existen en Supabase | High | Documentar SQL necesario, el dev las crea |
| bcryptjs no disponible en PostgreSQL | High | Usar pgcrypto para hash en RPC, o validar PIN en frontend antes de RPC |
| Sin datos de prueba multi-rol | Medium | Instrucciones para crear usuarios en Supabase dashboard |

## Rollback Plan

Revert commits de esta fase. Las RPCs nuevas no rompen funcionalidad existente. La navegación condicional default es mostrar todo (sin restricción) — safe fallback.

## Success Criteria

- [ ] Chef solo ve 4 tabs + perfil; admin ve 5 tabs + perfil + usuarios
- [ ] Cambio de PIN funciona para cualquier rol (validación: 4 dígitos, PIN actual correcto)
- [ ] Dashboard filtra por chef cuando se selecciona uno; "Todos" muestra agregado
- [ ] Admin puede listar, crear, activar/desactivar usuarios y cambiarles el PIN
- [ ] Chef_Jefe puede filtrar dashboard pero no ve gestión de usuarios
