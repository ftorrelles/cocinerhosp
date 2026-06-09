# Tasks — fase-11-dashboard-graficos

## A1 — SQL: Crear nuevas RPCs (supabase-fase11.sql)

- [ ] Write `obtener_produccion_por_dia(p_usuario_id, p_desde, p_hasta, p_categoria)` RPC
- [ ] Write `obtener_produccion_por_semana(p_usuario_id, p_mes, p_categoria)` RPC
- [ ] Save to `supabase-fase11.sql`

## A2 — Hook: useProduccionPorDia

- [ ] Create new file `src/hooks/useProduccionPorDia.ts`
- [ ] Import supabase client
- [ ] Interface `DiaProduccion` (fecha, total_raciones)
- [ ] Hook accepts usuarioId, desde, hasta, categoria
- [ ] Calls `obtener_produccion_por_dia` RPC
- [ ] Returns `{ data, loading, error, refresh }`

## A3 — Hook: useProduccionPorSemana

- [ ] Create new file `src/hooks/useProduccionPorSemana.ts`
- [ ] Import supabase client
- [ ] Interface `SemanaProduccion` (semana, total_raciones)
- [ ] Hook accepts usuarioId, mes, categoria
- [ ] Calls `obtener_produccion_por_semana` RPC
- [ ] Returns `{ data, loading, error, refresh }`

## B1 — BarChartVertical component

- [ ] Create `src/components/dashboard/BarChartVertical.tsx`
- [ ] Props interface: { data: number[], maxValue: number, highlightIndex: number, labels: string[], unit: string, title: string }
- [ ] Renders vertical bars with divs + Tailwind
- [ ] Bar height proportional to maxValue (max 120px)
- [ ] Today/week highlight: `bg-accent` vs `bg-accent/60`
- [ ] Labels below each bar
- [ ] Responsive for 390px (7 bars fit)

## B2 — Weekly chart in Dashboard

- [ ] Import and use `useProduccionPorDia` in Dashboard
- [ ] Generate week range (Mon–Sun) from selected week offset
- [ ] State: `semanaOffset` (0 = current, -1 = previous, etc.)
- [ ] Map API data to 7-day array (0 for missing days)
- [ ] Navigation buttons ← →
- [ ] Title: "Esta semana — 2 jun – 8 jun"
- [ ] Today index highlighted
- [ ] Position: between metrics and top platos

## B3 — Monthly chart in Dashboard

- [ ] Import and use `useProduccionPorSemana` in Dashboard
- [ ] State: `mesOffset` (0 = current, -1 = previous, etc.)
- [ ] Map API data to week array (S1–S5)
- [ ] Navigation buttons ← →
- [ ] Title: "Este mes — junio 2026"
- [ ] Current week highlighted
- [ ] Position: after weekly chart, before top platos

## B4 — Barquetas conversion in Dashboard

- [ ] MetricCard labels: "Barquetas este mes", "Media barquetas/día"
- [ ] MetricCard values: `Math.round(valor / 10)`
- [ ] Hechos hoy value: `Math.round(data.hechos_hoy / 10)`
- [ ] Top platos: show "N barquetas" instead of "N rac."
- [ ] Últimos registros: primary "N barquetas", secondary "(N raciones) · ..."

## B5 — Category filter applies to all charts

- [ ] Pass `selectedCategoria` to useProduccionPorDia and useProduccionPorSemana
- [ ] Refetch when category changes

## Verification

- [ ] `tsc --noEmit` passes
- [ ] `vitest run` — all tests pass
- [ ] `npm run build` — production build succeeds
