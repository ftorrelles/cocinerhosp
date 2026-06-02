# Proposal: fase-4-registrar-historial

## Intent

El chef necesita guardar cada elaboración del día (plato, raciones, servicio) y consultar el "parte de hoy" con los registros del día actual. Esto permite trazabilidad por chef y alimenta el dashboard mensual.

## Scope

### In Scope
- Formulario de registro: plato, raciones, servicio (almuerzo/cena)
- Guardar en Supabase via RPC `insertar_registro` con `usuario_id` del chef logueado
- "Parte de hoy": lista de registros del día actual del chef via RPC `obtener_registros_hoy`
- Hook `useHistorial.ts` encapsulando ambas RPCs
- Pantalla `Registrar.tsx` reemplazando PlaceholderPage

### Out of Scope
- Dashboard/métricas mensuales (Fase 5)
- Edición o borrado de registros
- Filtros por fecha o chef (solo el día actual del chef logueado)

## Capabilities

### New Capabilities
- `registrar-produccion`: formulario y guardado de producción diaria con trazabilidad por chef

## Approach

Hook `useHistorial.ts` expone `addRegistro()` y `getRegistrosHoy()` usando `supabase.rpc()`. El formulario valida campos antes de enviar. La lista del día se actualiza automáticamente después de cada guardado. Sin estado global — el hook maneja su propio estado local (loading, error, data).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useHistorial.ts` | New | Hook con addRegistro() y getRegistrosHoy() |
| `src/pages/Registrar.tsx` | New | Pantalla completa con formulario + parte de hoy |
| `src/App.tsx` | Modified | Reemplazar PlaceholderPage por Registrar |
| `supabase-setup.sql` | Modified | Agregar CREATE TABLE registros (documentación) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RPC `insertar_registro` no existe aún en producción | Medium | La tabla + RPCs ya están creadas según el usuario |
| Error de conexión Supabase al guardar | Low | Mostrar error claro al usuario |

## Rollback Plan

Revert cambios en `src/App.tsx` y eliminar los 2 archivos nuevos. La tabla en Supabase se queda (no rompe nada).

## Dependencies

- RPCs `insertar_registro` y `obtener_registros_hoy` existentes en Supabase
- `useAuth` hook existente para obtener `user.id`

## Success Criteria

- [ ] Chef puede escribir un plato, elegir servicio, poner raciones y guardar
- [ ] Después de guardar, el registro aparece en "Parte de hoy"
- [ ] Los registros persisten en Supabase y son únicos por chef
- [ ] Sin errores de TypeScript
