# Proposal — Dashboard: barquetas + gráficos de producción

## Intent
Mejorar el Dashboard para que la unidad visual principal sean barquetas (÷10) en lugar de raciones, y añadir gráficos de barras verticales de producción semanal y mensual.

## Motivation
Los chefs trabajan con barquetas (1 barqueta = 10 raciones) como unidad mental. Ver raciones los obliga a dividir mentalmente. Además, no tienen visibilidad de la producción agregada por día y semana.

## Scope

### Mejora 1 — Barquetas como unidad visual
- Cambiar labels en MetricCards: "Raciones este mes" → "Barquetas este mes" (valor ÷10)
- "Media raciones/día" → "Media barquetas/día" (valor ÷10)
- "Hechos hoy" → mostrar barquetas de hoy (÷10)
- Top platos: "804 rac." → "80 barquetas"
- Últimos registros: principal "80 barquetas", secundario "(800 raciones) · servicio · chef · categoria"
- La BD no cambia — solo visualización

### Mejora 2 — Gráficos de producción por tiempo
- Gráfico semanal: barras verticales por día (Lun-Dom), navegación ← →, hoy destacado en verde intenso
- Gráfico mensual: barras verticales por semana (S1-S4), navegación ← →, semana actual destacada
- Sin librerías externas — divs + Tailwind
- Mobile-first (390px)
- Nuevas RPCs para datos de producción por día/semana

## Out of Scope
- No se modifican los cálculos de la calculadora ni de blandas
- No se modifica la BD (registros table remains unchanged)

## SQL Needed
Se necesitan dos nuevas RPCs en Supabase:
- `obtener_produccion_por_dia(p_usuario_id UUID DEFAULT NULL, p_desde DATE, p_hasta DATE, p_categoria TEXT DEFAULT NULL)` — returns JSON array of {fecha, total_raciones}
- `obtener_produccion_por_semana(p_usuario_id UUID DEFAULT NULL, p_mes TEXT, p_categoria TEXT DEFAULT NULL)` — returns JSON array of {semana, total_raciones}
