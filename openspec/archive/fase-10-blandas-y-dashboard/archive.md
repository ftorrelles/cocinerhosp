# Archived Change — fase-10-blandas-y-dashboard

**Status:** ✅ Implemented and verified

## Summary

Añadir columna `categoria` a registros y actualizar cálculo de chinos en dietas blandas.

## Changes Made

1. **SQL**: `ALTER TABLE registros ADD COLUMN categoria`, updated `insertar_registro` RPC with `p_categoria`, updated `obtener_dashboard` RPC with `p_categoria` filter + `hechos_hoy` return
2. **src/data/blandas.ts**: Chino proportions 3:1 (papa:verdura), resumen total 47 bolsas
3. **src/hooks/useHistorial.ts**: `addRegistro` now accepts optional `categoria`
4. **src/hooks/useDashboard.ts**: accepts `categoria` filter, returns `hechos_hoy`
5. **src/components/blandas/TablaChinos.tsx**: input gastros + guardar button
6. **src/components/blandas/TablaMolido.tsx**: input barquetas + guardar button
7. **src/components/blandas/TablaPure.tsx**: input barquetas + guardar button
8. **src/components/calcular/ProteinaSection.tsx**: `categoria='proteina'` on guardar
9. **src/components/calcular/GuarnicionSection.tsx**: `categoria='guarnicion'` on guardar
10. **src/pages/Recetas.tsx**: `categoria='receta'` on guardar in expanded view
11. **src/pages/Dashboard.tsx**: category filter chips, Hechos hoy card, fix admin/chef_jefe initial load

## Verification

- `tsc --noEmit` passes
- `vitest run` — 15 tests pass
- `npm run build` — production build succeeds
