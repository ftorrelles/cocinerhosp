# Design: fase-8-roles-y-control

## Technical Approach

Extender el sistema existente agregando control de acceso basado en el campo `rol` ya presente en `UserSession`. No se necesita nueva infraestructura — solo condicionales en componentes, nuevas rutas, y hooks para nuevas RPCs de Supabase. El store ya tiene `user.rol`, los componentes solo leen de ahí.

## Architecture Decisions

### Decision: Obtención del rol

- **Choice**: Leer `user.rol` desde `useAppStore` en cada componente que necesite control de acceso
- **Alternatives**: Pasar rol via props desde ProtectedLayout / Context
- **Rationale**: El store ya tiene `user` con `rol` poblado desde el login. Leer directo del store evita prop drilling y mantiene el patrón existente (TopBar ya usa `useAppStore(s => s.user)`)

### Decision: BottomNav dinámico

- **Choice**: BottomNav recibe el rol y filtra las tabs con `useMemo`
- **Alternatives**: Componentes separados por rol en ProtectedLayout
- **Rationale**: Un solo componente con filter es más simple y mantiene el archivo bajo 150 líneas

### Decision: Protección de ruta /usuarios

- **Choice**: Componente wrapper `<AdminRoute>` dentro de App.tsx que redirige a `/` si rol !== 'admin'
- **Alternatives**: Lógica inline en Usuarios.tsx / ProtectedLayout
- **Rationale**: Separación clara, reutilizable, y el componente Usuarios no necesita saber de routing

### Decision: Cambio de PIN

- **Choice**: Función `cambiarPin()` en `useAuth.ts` que llama RPC `cambiar_pin`. El PIN actual se verifica del lado servidor con pgcrypto
- **Alternatives**: Verificar PIN actual en frontend con bcryptjs antes de llamar RPC
- **Rationale**: La RPC tiene acceso al `pin_hash` almacenado. Validar en servidor es más seguro. Si pgcrypto no está disponible, validar en frontend con bcryptjs como fallback

### Decision: Selector de chef en Dashboard

- **Choice**: `<select>` nativo estilizado con Tailwind, estado local `[selectedUserId, setSelectedUserId]`, pasado a `useDashboard`
- **Alternatives**: Dropdown custom / modal selector
- **Rationale**: Select nativo es mobile-friendly, accesible, y mínimo código. El estado local es suficiente porque no necesita persistir

### Decision: Lista de chefs para el selector

- **Choice**: Query simple `supabase.from('usuarios').select('id, nombre_completo').eq('activo', true).in('rol', ['chef', 'chef_jefe'])` dentro del hook useDashboard o componente Dashboard
- **Alternatives**: RPC separada `listar_chefs`
- **Rationale**: Query directa es suficiente, no necesita RPC. El hook ya carga datos del dashboard

## Data Flow

```
Login ──→ useAuth.signIn() ──→ RPC verificar_usuario ──→ UserSession { id, username, nombre_completo, rol }
                                                                        │
                                                                        ▼
                                                              useAppStore.setUser(session)
                                                                        │
                                   ┌───────────────────────────────────┼───────────────────────────┐
                                   ▼                                   ▼                           ▼
                              TopBar.tsx                          BottomNav.tsx              Dashboard.tsx
                          (ícono perfil siempre)               (tabs según rol)          (selector chef si rol≠chef)

/usuarios ──→ AdminRoute ──→ Usuarios.tsx ──→ useUsuarios ──→ RPCs listar, crear, toggle, cambiar_pin_admin
/perfil    ──→ Perfil.tsx ──→ useAuth.cambiarPin() ──→ RPC cambiar_pin
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Modify | Agregar `cambiarPin()` y `usuarios` (lista chefs) |
| `src/hooks/useUsuarios.ts` | Create | Hook con funciones listar, crear, toggle, cambiarPinAdmin |
| `src/components/layout/TopBar.tsx` | Modify | Agregar ícono perfil (IconSettings o IconUser) que navega a /perfil |
| `src/components/layout/BottomNav.tsx` | Modify | Tabs condicionales: si rol=admin, agregar tab Usuarios |
| `src/components/layout/AdminRoute.tsx` | Create | Wrapper que redirige a / si rol !== 'admin' |
| `src/App.tsx` | Modify | Agregar rutas /perfil y /usuarios (con AdminRoute) |
| `src/pages/Perfil.tsx` | Create | Formulario cambio de PIN |
| `src/pages/Usuarios.tsx` | Create | Lista + formulario creación + toggle + cambio PIN admin |
| `src/pages/Dashboard.tsx` | Modify | Agregar selector de chef condicional |

## Interfaces / Contracts

```typescript
// En useAuth.ts — nueva función
cambiarPin: (pinActual: string, pinNuevo: string) => Promise<{ error?: string }>

// En useUsuarios.ts
interface UseUsuariosReturn {
  usuarios: UsuarioAdmin[]
  loading: boolean
  error: string | null
  crearUsuario: (data: CrearUsuarioInput) => Promise<{ error?: string }>
  toggleUsuario: (id: string) => Promise<{ error?: string }>
  cambiarPinAdmin: (usuarioId: string, pinNuevo: string) => Promise<{ error?: string }>
  refresh: () => void
}

interface UsuarioAdmin {
  id: string
  username: string
  nombre_completo: string
  rol: 'admin' | 'chef_jefe' | 'chef'
  centro_id: string | null
  activo: boolean
  created_at: string
}

interface CrearUsuarioInput {
  nombre: string
  username: string
  pin: string
  rol: string
  centro_id?: string
}
```

## RPCs de Supabase necesarias

```sql
-- cambiar_pin: verifica pin actual con pgcrypto y actualiza
CREATE OR REPLACE FUNCTION cambiar_pin(p_usuario_id UUID, p_pin_actual TEXT, p_pin_nuevo TEXT)
RETURNS BOOLEAN AS $$
  -- Verifica pin_actual contra pin_hash, actualiza si coincide
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- listar_usuarios: todos los usuarios
CREATE OR REPLACE FUNCTION listar_usuarios()
RETURNS TABLE(id UUID, username TEXT, nombre_completo TEXT, rol TEXT, centro_id TEXT, activo BOOLEAN, created_at TIMESTAMPTZ)
AS $$ SELECT id, username, nombre_completo, rol, centro_id, activo, created_at FROM usuarios ORDER BY created_at DESC; $$
LANGUAGE sql SECURITY DEFINER;

-- crear_usuario: inserta con pin hasheado
CREATE OR REPLACE FUNCTION crear_usuario(p_nombre TEXT, p_username TEXT, p_pin TEXT, p_rol TEXT, p_centro_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
  -- Inserta en usuarios con crypt(p_pin, gen_salt('bf'))
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- toggle_usuario: activa/desactiva
CREATE OR REPLACE FUNCTION toggle_usuario(p_usuario_id UUID)
RETURNS BOOLEAN AS $$
  UPDATE usuarios SET activo = NOT activo WHERE id = p_usuario_id;
  SELECT FOUND;
$$ LANGUAGE sql SECURITY DEFINER;

-- cambiar_pin_admin: cambia pin sin verificar actual
CREATE OR REPLACE FUNCTION cambiar_pin_admin(p_usuario_id UUID, p_pin_nuevo TEXT)
RETURNS BOOLEAN AS $$
  -- UPDATE usuarios SET pin_hash = crypt(p_pin_nuevo, gen_salt('bf'))
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useAuth.cambiarPin()` validaciones | Mock RPC, test errores 4 dígitos, confirmación, PIN actual incorrecto |
| Unit | `useUsuarios` CRUD | Mock RPCs listar, crear, toggle, cambiarPinAdmin |
| Component | BottomNav según rol | Render con distintos roles, verificar tabs visibles |
| Component | Dashboard selector chef | Render con admin/chef_jefe/chef, verificar presencia del select |
| Component | AdminRoute | Render con admin (pasa), chef_jefe (redirect), chef (redirect) |

## Open Questions

- [ ] ¿pgcrypt está habilitado en el proyecto Supabase? Si no, usar bcryptjs en frontend para hashear antes de RPC
