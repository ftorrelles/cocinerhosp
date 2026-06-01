## Tasks: fase-2-calculadora

### Review Workload Forecast

- **Estimated changed lines**: ~500-650 (15 steps, new data files, pure functions, tests, components)
- **Files created**: ~15 new files, 1 modified (App.tsx)
- **Chained PRs recommended**: Yes (exceeds 400 lines)
- **400-line budget risk**: High
- **Decision needed before apply**: Ask user about splitting

### Task List

---

#### T1: Create static data files

**Depends on**: Nothing
**Files affected**: `src/data/centros.ts`, `src/data/mermas.ts`, `src/data/proteinaPresets.ts`, `src/data/guarnicionPresets.ts`

**Steps**:
1. Create `src/data/centros.ts`:
   - 6 centros con id, nombre, color, pax almuerzo y cena
   - Export array `CENTROS` and helper function `getPacientesPorServicio(servicio)`
2. Create `src/data/mermas.ts`:
   - 33 entries matching PROTOTYPE.html MERMAS array
   - Each with keywords[], protMerma?, guarMerma?, source
   - Export `MERMAS` array and `detectarMerma(texto, tipo)` function
3. Create `src/data/proteinaPresets.ts`:
   - 6 presets: Muslo pollo, Contramuslo, Pescado, Albóndigas, Hamburguesa, Quiché
   - Each with nombre, caja, racion, unidad
   - Export `PROTEINA_PRESETS` array
4. Create `src/data/guarnicionPresets.ts`:
   - 10 presets: Arroz, Macarrones, Habichuelas, Coliflor, Brócoli, Menestra, Zanahoria, Col Bruselas, Papas dólar, Puré de papa
   - Export `GUARNICION_PRESETS` array

**Acceptance**: Each file exports correctly, types are explicit, no `any`.

---

#### T2: Create pure calculation functions

**Depends on**: T1 (for types/constants)
**Files affected**: `src/lib/calculos.ts`

**Steps**:
1. Create `calcularProteina(params)` — PRD section 8 formula
2. Create `calcularBandejasHorno(params)` — for muslo de pollo (25/bandeja)
3. Create `calcularGuarnicion(params)` — with absorption handling (merma < 0)
4. Create `calcularDesgloseCentros(params)` — per-center breakdown
5. All functions are PURE — no side effects, no store access
6. Export interfaces: `ProteinaResult`, `GuarnicionResult`, `DesgloseCentro`

**Acceptance**: Functions compile with explicit return types, PRD formulas are followed exactly.

---

#### T3: Create calculation tests

**Depends on**: T2
**Files affected**: `src/lib/calculos.test.ts`

**Steps**:
1. Import functions from `calculos.ts`
2. Implement ALL 5 mandatory test cases from AGENTS.md section 9:
   - Albóndigas: 5 × 414 = 2070 → CEIL(2070/52) = 40 cajas
   - Muslo: 2 × 50 = 100 → CEIL(100/20) = 5 cajas, 0 sobrante
   - Guarnición habichuelas (22% merma): 50 pac → neto=6000g, bruto=7692g → 4 bolsas
   - Arroz (absorción ×3): 50 pac → neto=6000g, bruto=2000g → 1 bolsa
   - Hamburguesa: 1 × 414 = 414 → CEIL(414/52) = 8 cajas, sobrante=2
3. Run `npx vitest run` — all pass

**Acceptance**: `vitest run` passes all 5+ tests.

---

#### T4: Create Zustand store

**Depends on**: T1, T2
**Files affected**: `src/store/useAppStore.ts`

**Steps**:
1. Create Zustand store with:
   - `servicio: 'almuerzo' | 'cena'` — default 'almuerzo'
   - `pacientes: Record<string, number>` — initialized from centros.ts
   - `platos: Plato[]` — initial with 1 default plato (Muslo pollo + Arroz)
   - `resultados: ResultadoPlato[] | null`
   - Actions: `setServicio`, `setPaciente`, `addPlato`, `removePlato`, `updatePlato`, `toggleGuar2`, `calcular`, `resetResultados`
2. `calcular()` action reads all platos, runs pure functions, stores results
3. `setServicio()` resets pacientes per service defaults, resets resultados

**Acceptance**: Store actions work correctly, types are explicit.

---

#### T5: Create ServicioToggle component

**Depends on**: T4
**Files affected**: `src/components/calcular/ServicioToggle.tsx`

**Steps**:
1. Two-button toggle: Almuerzo (green) / Cena (blue)
2. Reads `servicio` from store, calls `setServicio` on tap
3. Active state: solid accent bg + white text
4. Inactive state: transparent bg + gray text
5. Icons: sun (☀️) for almuerzo, moon (🌙) for cena using Tabler Icons

**Acceptance**: Toggle switches service, colors update correctly.

---

#### T6: Create CentrosGrid component

**Depends on**: T4, T1
**Files affected**: `src/components/calcular/CentrosGrid.tsx`

**Steps**:
1. Grid 2-column layout with 6 center cards
2. Each: colored dot + name label + number input
3. Input: type number, min=0, centered, DM Mono font
4. Total bar below grid: service- colored bg, total patients in DM Mono 28px
5. Reads `pacientes` and `servicio` from store
6. Calls `setPaciente` on input change
7. Recalculates total on every change

**Acceptance**: Grid renders 6 centros, editing updates total, service switch resets values.

---

#### T7: Create ProteinaSection component

**Depends on**: T4, T1
**Files affected**: `src/components/calcular/ProteinaSection.tsx`

**Steps**:
1. Quick preset grid (3 columns, 6 presets)
2. Each preset button: icon + name, on tap fills all fields
3. Fields: Unidades/caja, Unidades/ración, Nombre unidad (g3 layout)
4. Merma field with auto/manual tag + source tooltip
5. Merma auto-detection on plato name change (via prop or callback)
6. Selected preset chip gets `.on` styling (green bg)

**Acceptance**: Presets fill fields, merma auto-detects, manual edit changes tag.

---

#### T8: Create GuarnicionSection component

**Depends on**: T4, T1
**Files affected**: `src/components/calcular/GuarnicionSection.tsx`

**Steps**:
1. Quick preset chips row (10 items, flex wrap)
2. Selected chip gets `.on` styling
3. Fields: Bolsa (kg), Merma %, g netos/ración (g3 layout)
4. Merma field with auto/manual tag + source tooltip
5. Props: `numero` (1 or 2), `isActive` for toggling visibility
6. Merma auto-detection on garnish name change

**Acceptance**: Presets work, merma auto-detects, fields are configurable.

---

#### T9: Create PlatoItem component

**Depends on**: T7, T8
**Files affected**: `src/components/calcular/PlatoItem.tsx`

**Steps**:
1. Header: plato name input + delete button (X icon)
2. Body: ProteinaSection + GuarnicionSection
3. Second garnish toggle button: "+ Añadir segunda guarnición" / "Quitar segunda guarnición"
4. When second garnish active: first g/ración → 60, second appears
5. When second garnish deactivated: first g/ración → 120, second hidden
6. Each PlatoItem receives `platoId` and reads/writes store for its data

**Acceptance**: Multiple platos work independently, second garnish toggles correctly.

---

#### T10: Create ResultadoPlato component

**Depends on**: T2 (result types)
**Files affected**: `src/components/calcular/ResultadoPlato.tsx`

**Steps**:
1. Card with header: service-colored bg, plato name + service name
2. Proteína bloque: cajas a abrir (big number), unidades, sobrante
3. Guarnición 1 bloque: bolsas a abrir, kg bruto, kg neto, sobrante
4. Guarnición 2 bloque (if active): same format
5. Merma label: "Merma X%" or "Peso en seco (absorbe ×X)"
6. Desglose por centro: colored pills showing each center's units
7. Sobrante: green check if 0, warn text if >0 with raciones extra

**Acceptance**: Results render correctly for all calculation cases.

---

#### T11: Create Calcular page

**Depends on**: T5, T6, T9, T10, T4
**Files affected**: `src/pages/Calcular.tsx`

**Steps**:
1. Assembles: Servicio card → Platos card → Calcular button card
2. "Calcular" button: full-width, accent color, icon + label with total
3. Validation before calculate: platos exist, patients > 0
4. Results section: renders ResultadoPlato for each plato
5. "Añadir otro plato" button at bottom of platos card
6. Matches PROTOTYPE.html layout exactly

**Acceptance**: Full calculator flow works end-to-end.

---

#### T12: Update App.tsx with Calcular route

**Depends on**: T11
**Files affected**: `src/App.tsx`

**Steps**:
1. Import `Calcular` from pages
2. Replace placeholder for `/` route with `<Calcular />`

**Acceptance**: `/` route renders calculator instead of placeholder.

---

#### T13: Install vitest and run tests

**Depends on**: T3
**Files affected**: `package.json`

**Steps**:
1. `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Add `test` script to package.json: `"test": "vitest run"`
3. Create `vitest.config.ts` or configure in vite.config.ts
4. Run `npx vitest run` — all tests pass

**Acceptance**: `vitest run` passes, Strict TDD can be enabled.

---

#### T14: TypeScript compilation

**Depends on**: All previous
**Files affected**: None (verification)

**Steps**:
1. Run `npx tsc --noEmit`
2. Fix any type errors
3. Verify no `any` types

**Acceptance**: Zero TS errors.

---

#### T15: Production build

**Depends on**: T14
**Files affected**: None (verification)

**Steps**:
1. Run `npm run build`
2. Verify no errors
3. Verify PWA is generated

**Acceptance**: Build succeeds with PWA.

### Parallelization Map

```
T1 ──┬── T2 ── T3 (tests) ── T13 (vitest)
     │
     └── T4 (store) ──┬── T5 (ServicioToggle)
                       ├── T6 (CentrosGrid)
                       ├── T7 (ProteinaSection)
                       ├── T8 (GuarnicionSection)
                       ├── T9 (PlatoItem) ── T7 + T8
                       └── T10 (ResultadoPlato)

T5 + T6 + T9 + T10 ── T11 (Calcular) ── T12 (App.tsx) ── T14 (tsc) ── T15 (build)
```

**Serial chain**: T1 → T2 → T3 → T4 → T11 → T12 → T14 → T15
**Parallel after T4**: T5, T6, T7, T8, T10 (all independent)
**T9 depends on**: T7 + T8
**T13 depends on**: T3 (can run after tests are written)
