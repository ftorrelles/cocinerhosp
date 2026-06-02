# Proposal: fase-5-dashboard

## Intent

El chef necesita ver métricas mensuales de producción: total raciones, elaboraciones, días con registro, media diaria, top platos más elaborados y los últimos registros. Esto permite tener visibilidad de la producción sin salir de la app.

## Scope

### In Scope
- 4 tarjetas métricas: total raciones, elaboraciones, días con registro, media/día
- Top 6 platos con gráfico de barras horizontal
- Últimos 8 registros con fecha, chef, servicio
- Hook `useDashboard.ts` encapsulando RPC `obtener_dashboard`
- Estados: loading, empty (sin datos), error

### Out of Scope
- Filtro por chef (supervisor view — futuro)
- Comparativa almuerzo vs cena (futuro)
- Exportar datos

## Capabilities

### New Capabilities
- `dashboard-mensual`: visualización de métricas de producción del mes actual

## Approach

Hook `useDashboard.ts` llama RPC `obtener_dashboard(p_usuario_id, p_mes)` y tipa la respuesta JSON. El hook maneja estado local (loading, data, error). La página renderiza 3 secciones: métricas (grid 2×2), gráfico de barras, historial reciente.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useDashboard.ts` | New | Hook con datos del dashboard |
| `src/pages/Dashboard.tsx` | New | Pantalla completa con métricas + gráfico + historial |
| `src/App.tsx` | Modified | Reemplazar PlaceholderPage por Dashboard |

## Risks

None. RPC ya creada y probada en Supabase.

## Rollback Plan

Revert cambios en App.tsx y eliminar useDashboard.ts + Dashboard.tsx.

## Dependencies

- RPC `obtener_dashboard` existente en Supabase

## Success Criteria

- [ ] Chef ve 4 métricas del mes actual
- [ ] Top 6 platos con barras proporcionales visibles
- [ ] Últimos registros con chef y servicio
- [ ] Sin errores de TypeScript
- [ ] Build exitoso
