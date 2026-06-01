# Tasks: fase-3-dietas-blandas

## Review Workload Forecast

- **Estimated changed lines**: ~120-150 (static page, no logic, 6 small files)
- **Files created**: 5 new, 1 modified
- **Chained PRs recommended**: No (under 200 lines)
- **400-line budget risk**: Low
- **Decision**: Single PR

## Task List

---

#### T1: Create static data file

**Depends on**: Nothing
**Files affected**: `src/data/blandas.ts`

**Steps**:
1. Define interfaces: `Chino`, `MolidoIngrediente`, `MolidoProteina`, `PureData`
2. Export `CHINOS: Chino[]` — 3 entries from PRD section 1.6
3. Export `MOLIDO_INGREDIENTES: MolidoIngrediente[]` — all ingredients
4. Export `MOLIDO_PROTEINA: MolidoProteina[]` — pollo y cerdo
5. Export `PURE: PureData` — 32 bolsas, 15% merma, ~68kg neto
6. Export `RESUMEN_BOLSAS` — { papas: 39, zanahoria: 3, calabaza: 2, calabacin: 4, total: 48 }

**Acceptance**: Data exports correctly, all types explicit.

---

#### T2: Create TablaChinos component

**Depends on**: T1
**Files affected**: `src/components/blandas/TablaChinos.tsx`

**Steps**:
1. Import CHINOS from data/blandas
2. Card with header: "Chinos — 22 barquetas × 3 kg = 66 kg/día"
3. Table: Tipo | Ingredientes | Bolsas | Bruto
4. Each row: nombre, ingredientes string, bolsas number, brutoKg + "kg"
5. Numbers in DM Mono

**Acceptance**: 3 rows render correctly with same visual style as calculator.

---

#### T3: Create TablaMolido component

**Depends on**: T1
**Files affected**: `src/components/blandas/TablaMolido.tsx`

**Steps**:
1. Card with header: "Molido — 20 barquetas × 3 kg = 60 kg/día"
2. List of ingredients: icon bullet + nombre + cantidad
3. Separator or sub-card for "Proteína variable" with pollo/cerdo options
4. Note about agua/caldo "hasta 60 kg"

**Acceptance**: All ingredients shown, protein variants displayed.

---

#### T4: Create TablaPure component

**Depends on**: T1
**Files affected**: `src/components/blandas/TablaPure.tsx`

**Steps**:
1. Card with header: "Puré de papas — 22 barquetas × 3 kg = 66 kg/día"
2. Table: Ingrediente | Cantidad
3. Row 1: Papas congeladas — "32 bolsas (80 kg)"
4. Row 2: Merma 15% — "−12 kg" (warn color)
5. Row 3: Papa cocida disponible — "~68 kg" (accent color, bold)
6. Footnote: "Sal + aceite al gusto (~300-400 ml aceite)"

**Acceptance**: Pure table renders correctly with styling.

---

#### T5: Create Blandas page

**Depends on**: T2, T3, T4
**Files affected**: `src/pages/Blandas.tsx`

**Steps**:
1. Header: title "Dietas Blandas" (IconSoup or similar) + subtitle
2. Badge: "48 bolsas congeladas / día" — DM Mono 28px, accent bg, white
3. Desglose badge: papas 39, zanahoria 3, calabaza 2, calabacín 4
4. Assemble TablaChinos → TablaMolido → TablaPure
5. No state, no effects, pure presentational

**Acceptance**: Page renders all tables + summary, matches PRD data.

---

#### T6: Update App.tsx route

**Depends on**: T5
**Files affected**: `src/App.tsx`

**Steps**:
1. Import `Blandas` from pages
2. Replace `<PlaceholderPage title="Dietas Blandas" />` with `<Blandas />`

**Acceptance**: /blandas route shows the Blandas page.

---

#### T7: TypeScript + Build verification

**Depends on**: T5, T6
**Files affected**: None (verification)

**Steps**:
1. Run `npx tsc --noEmit`
2. Run `npm run build`
3. Verify no errors, PWA generated

**Acceptance**: Zero TS errors, build succeeds.

## Parallelization Map

```
T1 ──┬── T2 (TablaChinos)
     ├── T3 (TablaMolido)
     ├── T4 (TablaPure)
     └── T5 (Blandas page) ── T6 (App.tsx) ── T7 (tsc + build)

Serial chain: T1 → T2/T3/T4 → T5 → T6 → T7
```
