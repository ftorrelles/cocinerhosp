# Delta — Dashboard Métricas (fase-11)

> Delta sobre `openspec/specs/dashboard-metricas/spec.md`.
> Solo se detallan los cambios; el resto del spec base permanece vigente.

## MODIFIED Requirements

### Requirement: Métricas en barquetas

All metric displays on the Dashboard MUST show barquetas (raciones ÷ 10) as the primary unit. Raciones in parentheses as secondary detail where applicable. The conversion is `Math.round(valor / 10)`.

- "Raciones este mes" → "Barquetas este mes", value = `Math.round(data.total_raciones / 10)`
- "Media raciones/día" → "Media barquetas/día", value = `Math.round(data.media_diaria / 10)`
- "Hechos hoy" → value = `Math.round(data.hechos_hoy / 10)`

#### Scenario: Metric cards show barquetas

- GIVEN data.total_raciones = 804
- WHEN the dashboard renders
- THEN the MetricCard shows "80" with label "Barquetas este mes"

#### Scenario: Media shows barquetas

- GIVEN data.media_diaria = 67
- THEN the MetricCard shows "7" with label "Media barquetas/día"

### Requirement: Top platos barquetas

In the "Platos más elaborados" chart, each bar row MUST show the value as barquetas (raciones ÷ 10) followed by " barquetas". Example: "80 barquetas" instead of "804 rac."

#### Scenario: Top plato shows barquetas

- GIVEN a top plato with 804 raciones
- WHEN rendered in the bar chart
- THEN the label shows "80 barquetas"

### Requirement: Últimos registros dual display

Each "Últimos registros" entry MUST show barquetas as the primary value, with raciones in parentheses as secondary detail. The secondary line shows: "(N raciones) · servicio · chef · categoria".

#### Scenario: Registro shows both barquetas and raciones

- GIVEN a registro with 800 raciones
- WHEN rendered
- THEN the primary text shows "80 barquetas"
- AND the secondary text shows "(800 raciones) · Almuerzo · Francisco Torres · proteina"

## ADDED Requirements

### Requirement: Weekly production bar chart

The Dashboard MUST display a vertical bar chart showing production (in barquetas) per day for the selected week, positioned between the metric cards and the "Platos más elaborados" section.

- Each bar represents one day (Mon–Sun), with 7 bars total
- Bar height is proportional to the maximum day in the selected period
- Width: fixed, responsive for 390px viewport (7 bars fit with ~8px gaps)
- Today's bar: `#1B5E3F` (green accent)
- Other bars: `#A8C5B0` (60% opacity green)
- No-data days: height 0, show a thin 2px line at baseline
- Navigation: ← and → buttons to move week by week
- Title: "Esta semana — 2 jun – 8 jun" (date range of selected week)
- Data: fetched from `obtener_produccion_por_dia` RPC

#### Scenario: Weekly chart renders 7 bars

- GIVEN the user is on Dashboard
- WHEN data loads for the current week
- THEN 7 bars are shown (Mon–Sun)
- AND today's bar is highlighted in green
- AND the title shows the date range

#### Scenario: Navigate weeks

- GIVEN the user is viewing current week
- WHEN they tap ←
- THEN the chart shows the previous week
- AND data refetches for that week
- AND "Semana anterior" is reflected in the title

#### Scenario: Day without production

- GIVEN a day in the selected week has no registros
- THEN that day's bar shows height 0 (thin baseline line)
- AND the day label (Lun, Mar, etc.) is still shown

#### Scenario: Category filter applies to chart

- GIVEN a category filter is active on Dashboard
- WHEN the weekly chart loads
- THEN the filter is passed to `obtener_produccion_por_dia`

### Requirement: Monthly production bar chart

The Dashboard MUST display a vertical bar chart showing production per week of the month, positioned after the weekly chart.

- One bar per ISO week (S1, S2, S3, S4, S5 if applicable)
- Bar height proportional to max-week of selected month
- Current week highlighted: `#1B5E3F`
- Other bars: `#A8C5B0`
- Navigation: ← → for previous/next month
- Title: "Este mes — junio 2026"
- Data: fetched from `obtener_produccion_por_semana` RPC

#### Scenario: Monthly chart renders week bars

- GIVEN the user is on Dashboard
- WHEN data loads for the current month
- THEN bars are shown for each week with production data

#### Scenario: Navigate months

- GIVEN the user is viewing current month
- WHEN they tap →
- THEN the chart shows the next month
- AND data refetches for that month

#### Scenario: Category filter applies

- GIVEN a category filter is active
- WHEN the monthly chart loads
- THEN the filter is passed to `obtener_produccion_por_semana`
