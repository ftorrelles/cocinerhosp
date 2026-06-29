# Tasks: reparto-guarniciones

## Review Workload Forecast

- **Estimated changed lines**: ~82
- **Files modified**: 5
- **Chained PRs recommended**: No (under 100 lines)
- **400-line budget risk**: Low
- **Decision**: Single PR

## Task List

---

#### T1: Agregar función calcularReparto en calculos.ts

**Depends on**: Nothing
**Files affected**: `src/lib/calculos.ts`

**Steps**:
1. Exportar `calcularReparto(totalPacientes: number, cantidad: number): number[]`
2. Si `cantidad <= 1` → `[totalPacientes]`
3. Calcular `base = Math.floor(totalPacientes / cantidad)` y `resto = totalPacientes % cantidad`
4. Array de `cantidad` elementos: primero `base + resto`, resto `base`

**Acceptance**: Función pura, exportada, tipado estricto.

---

#### T2: Agregar tests de calcularReparto

**Depends on**: T1
**Files affected**: `src/lib/calculos.test.ts`

**Steps**:
1. Nuevo `describe('calcularReparto', ...)` con 6 tests:
   - `calcularReparto(414, 1)` → `[414]`
   - `calcularReparto(414, 2)` → `[207, 207]`
   - `calcularReparto(414, 3)` → `[138, 138, 138]`
   - `calcularReparto(415, 3)` → `[139, 138, 138]`
   - `calcularReparto(101, 2)` → `[51, 50]`
   - `calcularReparto(0, 3)` → `[0, 0, 0]`

**Acceptance**: `npx vitest run` pasa los 6 nuevos tests.

---

#### T3: Actualizar store — pacientesAsignados + recálculo + límite 3

**Depends on**: T1
**Files affected**: `src/store/useAppStore.ts`

**Steps**:
1. Agregar `pacientesAsignados: number` a `PreparacionGuarnicion`
2. `createDefaultGuarnicion()` inicializa `pacientesAsignados: 0`
3. Importar `calcularReparto` desde `../lib/calculos`
4. Agregar método `recalcularAsignaciones` al store:
   - Calcula total de pacientes
   - Llama `calcularReparto(total, guarniciones.length)`
   - Setea `pacientesAsignados` en cada guarnición
5. Modificar `addGuarnicion`:
   - `if (state.guarniciones.length >= 3) return`
   - Llamar `recalcularAsignaciones()` después de agregar
6. Modificar `removeGuarnicion`:
   - Llamar `recalcularAsignaciones()` después de remover
7. Modificar `calcularGuarnicionPrep`:
   - Usar `prep.pacientesAsignados` en vez de `totalPacientes`
8. Modificar `setServicio`:
   - Llamar `recalcularAsignaciones()` después de cambiar servicio

**Acceptance**: Store reasigna pacientes al añadir/quitar/cambiar servicio, límite 3 respetado.

---

#### T4: Actualizar GuarnicionSection — header con pacientes asignados

**Depends on**: T3
**Files affected**: `src/components/calcular/GuarnicionSection.tsx`

**Steps**:
1. Agregar `index` y `totalGuarniciones` a props
2. En el header, después del nombre editable, agregar badge:
   ```
   {pacientesAsignados} pacientes ({pct}%)
   ```
   - `pct = Math.round(pacientesAsignados / totalPacientes * 100)`
   - Badge: `bg-accent-light text-accent font-mono text-[11px] px-2 py-[2px] rounded-sm`
3. El botón "Calcular" se deshabilita si `prep.pacientesAsignados === 0`

**Acceptance**: Badge visible con pacientes y porcentaje correctos.

---

#### T5: Actualizar Calcular.tsx — límite 3 + pasar index

**Depends on**: T4
**Files affected**: `src/pages/Calcular.tsx`

**Steps**:
1. Pasar `index` y `totalGuarniciones` a `GuarnicionSection`
   ```tsx
   <GuarnicionSection key={g.id} preparacionId={g.id} index={i} totalGuarniciones={guarniciones.length} />
   ```
2. Reemplazar botón "Añadir" por:
   ```tsx
   {guarniciones.length < 3 && (
     <button ...>Añadir otra guarnición</button>
   )}
   ```

**Acceptance**: Botón oculto con 3 guarniciones, index pasado correctamente.

---

#### T6: TypeScript + Build + Tests

**Depends on**: T2, T5
**Files affected**: None (verification)

**Steps**:
1. `npx tsc --noEmit`
2. `npx vitest run`
3. `npm run build`

**Acceptance**: 0 TS errors, all tests pass, build succeeds.

## Parallelization Map

```
T1 ──┬── T2 (tests)
     └── T3 (store) ── T4 (GuarnicionSection) ── T5 (Calcular page) ── T6 (verify)
```

Serial chain: T1 → T2/T3 → T4 → T5 → T6
