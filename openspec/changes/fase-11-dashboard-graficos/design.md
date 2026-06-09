# Design — Dashboard: barquetas + gráficos de producción

## SQL Changes

### New RPC: `obtener_produccion_por_dia`

```sql
CREATE FUNCTION public.obtener_produccion_por_dia(
  p_usuario_id UUID DEFAULT NULL,
  p_desde DATE,
  p_hasta DATE,
  p_categoria TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT JSON_AGG(sub ORDER BY sub.fecha)
  INTO v_result
  FROM (
    SELECT r.fecha, SUM(r.raciones)::INTEGER AS total_raciones
    FROM public.registros r
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
      AND r.fecha >= p_desde
      AND r.fecha <= p_hasta
      AND (p_categoria IS NULL OR r.categoria = p_categoria)
    GROUP BY r.fecha
  ) sub;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;
```

### New RPC: `obtener_produccion_por_semana`

```sql
CREATE FUNCTION public.obtener_produccion_por_semana(
  p_usuario_id UUID DEFAULT NULL,
  p_mes TEXT,
  p_categoria TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT JSON_AGG(sub ORDER BY sub.semana)
  INTO v_result
  FROM (
    SELECT
      EXTRACT(WEEK FROM r.fecha)::INTEGER AS semana,
      SUM(r.raciones)::INTEGER AS total_raciones
    FROM public.registros r
    WHERE (p_usuario_id IS NULL OR r.usuario_id = p_usuario_id)
      AND to_char(r.fecha, 'YYYY-MM') = p_mes
      AND (p_categoria IS NULL OR r.categoria = p_categoria)
    GROUP BY EXTRACT(WEEK FROM r.fecha)
  ) sub;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;
```

## TypeScript Interfaces

### `useDashboard` — additions

```typescript
export interface DiaProduccion {
  fecha: string
  total_raciones: number
}

export interface SemanaProduccion {
  semana: number
  total_raciones: number
}
```

### New hook: `useProduccionPorDia`

```typescript
interface UseProduccionPorDiaReturn {
  data: DiaProduccion[]
  loading: boolean
  error: string | null
  refresh: () => void
}

function useProduccionPorDia(
  usuarioId: string | undefined,
  desde: string,
  hasta: string,
  categoria?: string,
): UseProduccionPorDiaReturn
```

### New hook: `useProduccionPorSemana`

```typescript
interface UseProduccionPorSemanaReturn {
  data: SemanaProduccion[]
  loading: boolean
  error: string | null
  refresh: () => void
}

function useProduccionPorSemana(
  usuarioId: string | undefined,
  mes: string,
  categoria?: string,
): UseProduccionPorSemanaReturn
```

## Component Tree

```
Dashboard
├── renderChefFilter (unchanged)
├── CategoriaChips (unchanged)
├── MetricCards (labels + values ÷10)
├── BarChartSemanal (NEW)
│   ├── nav ← →
│   ├── title "Esta semana — 2 jun – 8 jun"
│   └── 7 vertical bars (divs)
├── BarChartMensual (NEW)
│   ├── nav ← →
│   ├── title "Este mes — junio 2026"
│   └── 4-5 vertical bars (divs)
├── TopPlatos (ractions ÷10)
└── UltimosRegistros (dual barquetas + raciones)
```

## Bar Chart Rendering Strategy

Each bar is a `<div>` with:
- `display: flex; flex-direction: column; align-items: center`
- Inner `<div>` as the bar with `height` set proportionally
- Max height: 120px (mobile-friendly)
- Width: `calc((100% - 6 * gap) / 7)` for weekly, `calc((100% - 3 * gap) / 4)` for monthly
- Day/week label below the bar
- Date range below label for weekly

```tsx
function BarChartVertical({ data, maxValue, highlightIndex, labels, unit }: BarChartProps) {
  // data: number[] — barquetas per bucket
  // maxValue: number — for scaling
  // highlightIndex: number — which bar to highlight (today's bar)
  // labels: string[] — day/week labels
  // unit: string — 'barquetas'
}
```

## Data Flow

1. Dashboard loads → `useDashboard` fetches monthly metrics (unchanged)
2. Weekly chart: `useProduccionPorDia` with week range (Mon–Sun of selected week)
3. Monthly chart: `useProduccionPorSemana` with current month
4. Category filter change → refetch all hooks
5. Week navigation → update week state, refetch weekly hook
6. Month navigation → update month state, refetch monthly hook

## CSS (Tailwind)

No custom CSS needed. Bars use:
- `flex flex-col items-center gap-1`
- `w-full h-[120px] flex items-end justify-center`
- Bar: `w-full rounded-t-md transition-all duration-300`
- Today: `bg-accent` (`#1B5E3F`)
- Other: `bg-accent/60` (60% opacity)
- Gap between bars: `gap-[8px]`
- Container: `flex justify-between items-end`
