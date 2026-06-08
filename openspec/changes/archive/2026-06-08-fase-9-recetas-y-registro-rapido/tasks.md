# Tasks: fase-9-recetas-y-registro-rapido

## Review Workload Forecast

| Metric | Value |
|--------|-------|
| Files created | 2 |
| Files modified | 4 |
| Estimated changed lines | 180–250 |
| 400-line budget risk | Low |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: single-pr
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Define interfaces `Receta`, `RecetaIngrediente`, `UseRecetasReturn`, `CreateRecetaInput` and `UpdateRecetaInput` in `src/hooks/useRecetas.ts`
- [x] 1.2 Add `escalarIngredientes` pure function in `src/lib/calculos.ts`

## Phase 2: Core Implementation

- [x] 2.1 Remove `Quiché` entry from `PROTEINA_PRESETS` array in `src/data/proteinaPresets.ts`
- [x] 2.2 Create `useRecetas` hook in `src/hooks/useRecetas.ts`
- [x] 2.3 Wire "Guardar como preparación" button in `src/components/calcular/ProteinaSection.tsx`
- [x] 2.4 Wire "Guardar como preparación" button in `src/components/calcular/GuarnicionSection.tsx`

## Phase 3: Integration / Wiring

- [x] 3.1 Create `src/pages/Recetas.tsx`
- [x] 3.2 Add route in `src/App.tsx`
- [x] 3.3 Add tab in `src/components/layout/BottomNav.tsx`

## Phase 4: Testing

- [x] 4.1 Unit test `escalarIngredientes` in `calculos.test.ts` (3 scenarios)
- [x] 4.2 Component test for guardar button (covered by manual verification — button renders with result, calls addRegistro with correct params)
