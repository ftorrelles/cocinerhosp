# Design: fase-9-recetas-y-registro-rapido

## Technical Approach

Three independent changes: (1) remove Quiché preset, (2) new Recetas page with CRUD + auto-scaling, (3) "Guardar como preparación" button in calculate results. All changes are additive — no refactors. The Recetas page reuses existing `ServicioToggle` and `CentrosGrid` components and follows the same hook pattern as `useHistorial.ts`.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Recetas state management | Local state in `useRecetas` hook | Zustand global store | Recetas are fetched-on-mount, no global reactivity needed; matches existing hook pattern |
| Auto-scaling function | Pure function in `src/lib/calculos.ts` | Inline in component | Follows existing pure-function convention; testable |
| Role gating | Conditional render in component | RPC-level only | UI must match backend; RPC already enforces, component avoids showing disabled buttons |
| Guardar confirmation | Local `useState` boolean in each Section | Toast/global notification | Simplest path, no new deps; state resets on recalculation |
| Receta modal | Inline in `Recetas.tsx` | Separate component file | Single page usage; extract only if reused elsewhere |

## Data Flow

```
┌─ Recetas.tsx ──────────────────────────────┐
│                                             │
│  ServicioToggle ─► useAppStore.servicio     │
│  CentrosGrid    ─► useAppStore.pacientes    │
│                                             │
│  useRecetas()                                │
│    ├─ listar_recetas() ─► recetas[]         │
│    ├─ crear_receta()   ─► optim. refresh    │
│    ├─ editar_receta()  ─► optim. refresh    │
│    └─ eliminar_receta() ─► optim. refresh   │
│                                             │
│  Al seleccionar receta:                     │
│    factor = totalPacientes / raciones_base   │
│    ingredientes[n].cantidad *= factor        │
│                                             │
└─────────────────────────────────────────────┘

┌─ ProteinaSection / GuarnicionSection ──────┐
│                                             │
│  Resultado inline visible?                  │
│    └─ render "Guardar como preparación" btn │
│         └─ onClick:                         │
│              useHistorial().addRegistro({    │
│                plato: prep.nombre,           │
│                servicio,                     │
│                raciones: totalPacientes      │
│              })                              │
│              setGuardado(true) // local      │
│              // show "Preparación guardada ✓"│
└─────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/data/proteinaPresets.ts` | Modified | Remove `Quiché` entry from `PROTEINA_PRESETS` array |
| `src/hooks/useRecetas.ts` | New | Hook exposing `recetas`, `loading`, `error`, `createReceta`, `updateReceta`, `deleteReceta` via supabase.rpc |
| `src/pages/Recetas.tsx` | New | Full page: ServicioToggle + CentrosGrid header, recipe card grid, create/edit modal, auto-scaling logic |
| `src/App.tsx` | Modified | Add `<Route path="/recetas" element={<Recetas />} />` inside ProtectedLayout |
| `src/components/layout/BottomNav.tsx` | Modified | Add `{ to: '/recetas', label: 'Recetas', icon: IconBook }` to `ALL_TABS` (no adminOnly) |
| `src/components/calcular/ProteinaSection.tsx` | Modified | Show "Guardar como preparación" button when `showResult` is true; call `addRegistro` on click |
| `src/components/calcular/GuarnicionSection.tsx` | Modified | Same as ProteinaSection |

## Interfaces / Contracts

```typescript
// src/hooks/useRecetas.ts
interface RecetaIngrediente {
  id: string
  nombre: string
  cantidad: number
  unidad: string
  orden: number
}

interface Receta {
  id: string
  nombre: string
  servicio: string | null
  raciones_base: number
  temperatura: string | null
  tiempo: string | null
  notas: string | null
  ingredientes: RecetaIngrediente[]
  created_at: string
}

interface UseRecetasReturn {
  recetas: Receta[]
  loading: boolean
  error: string | null
  createReceta: (data: CreateRecetaInput) => Promise<{ error?: string }>
  updateReceta: (id: string, data: UpdateRecetaInput) => Promise<{ error?: string }>
  deleteReceta: (id: string) => Promise<{ error?: string }>
}

type CreateRecetaInput = {
  nombre: string
  servicio?: string | null
  raciones_base?: number
  temperatura?: string | null
  tiempo?: string | null
  notas?: string | null
  ingredientes: Omit<RecetaIngrediente, 'id'>[]
}
```

## Testing Strategy

| Area | Approach |
|---|---|
| `calculos.ts` | New test: `escalarIngredientes` multiplies by `totalPacientes / raciones_base`; returns unchanged if `raciones_base === 0` |
| `useRecetas.ts` | Integration test with mocked `supabase.rpc` (follow existing vitest pattern) |
| `ProteinaSection` / `GuarnicionSection` | Component test: button renders when `showResult` is true, calls `addRegistro` with correct `plato` name |
| Auto-scaling UI | Manual: select receta with 414 pacientes, verify factor = 34.5 and ingredient amounts scale |

## Migration

None. SQL (`supabase-recetas.sql`) must be executed in Supabase Dashboard before the page loads — handle gracefully: show error state if RPCs return "function not found". The Quiché removal is immediate.

## Open Questions

1. Should the "Guardar como preparación" button use the preset name or the custom input name as `plato`? → Use whatever `prep.nombre` currently shows (the actual value in the input), as spec confirms "Ensalada especial" works.
2. Should `useRecetas` cache recetas across page navigation? → Not needed for MVP; re-fetch on mount per existing hook pattern.
