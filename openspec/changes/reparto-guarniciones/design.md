# Design: reparto-guarniciones

## Architecture

### Data flow

```
Usuario añade/quita guarnición
        │
        ▼
Store.addGuarnicion / Store.removeGuarnicion
        │
        ▼
recalcularAsignaciones() ← se llama después de mutar el array
        │
        ▼
calcularReparto(totalPacientes, guarniciones.length)
        │
        ▼
cada guarnición recibe su pacientesAsignados
        │
        ▼
Usuario click "Calcular" en una guarnición
        │
        ▼
Store.calcularGuarnicionPrep(id)
  → usa prep.pacientesAsignados en vez de totalPacientes
  → llama calcularGuarnicion({ totalPacientes: prep.pacientesAsignados, ... })
```

### Cambio de servicio → recálculo
```
setServicio()
  → cambia pacientes[]
  → llama recalcularAsignaciones()
```

## Module changes

### src/lib/calculos.ts

```typescript
export function calcularReparto(
  totalPacientes: number,
  cantidad: number,
): number[] {
  if (cantidad <= 1) return [totalPacientes]
  const base = Math.floor(totalPacientes / cantidad)
  const resto = totalPacientes % cantidad
  return Array.from({ length: cantidad }, (_, i) =>
    i === 0 ? base + resto : base,
  )
}
```

### src/store/useAppStore.ts

**Type change:**
```typescript
export interface PreparacionGuarnicion {
  // ... existing fields
  pacientesAsignados: number  // ← NEW
}
```

**New helper inside store:**
```typescript
recalcularAsignaciones: () => {
  const state = get()
  const total = Object.values(state.pacientes).reduce((a, b) => a + b, 0)
  const shares = calcularReparto(total, state.guarniciones.length)
  set({
    guarniciones: state.guarniciones.map((g, i) => ({
      ...g,
      pacientesAsignados: shares[i] ?? total,
    })),
  })
}
```

**Modified addGuarnicion:**
```typescript
addGuarnicion: (preset) => {
  const state = get()
  if (state.guarniciones.length >= 3) return  // ← LIMIT
  set((s) => {
    const nueva = createDefaultGuarnicion()
    if (preset) Object.assign(nueva, preset)
    return { guarniciones: [...s.guarniciones, nueva] }
  })
  get().recalcularAsignaciones()  // ← recalculate after add
},
```

**Modified removeGuarnicion:**
```typescript
removeGuarnicion: (id) => {
  set((state) => ({
    guarniciones: state.guarniciones.filter((g) => g.id !== id),
  }))
  get().recalcularAsignaciones()  // ← recalculate after remove
},
```

**Modified calcularGuarnicionPrep:**
```typescript
calcularGuarnicionPrep: (id) => {
  const state = get()
  const prep = state.guarniciones.find((g) => g.id === id)
  if (!prep || prep.pacientesAsignados === 0) return

  const resultado = calcularGuarnicion({
    totalPacientes: prep.pacientesAsignados,  // ← WAS: totalPacientes
    bolsaKg: prep.bolsaKg,
    mermaP: prep.merma,
    racionG: prep.gramos,
  })

  set((s) => ({
    resultadosGuarniciones: {
      ...s.resultadosGuarniciones,
      [id]: resultado,
    },
  }))
},
```

**Modified setServicio:**
```typescript
setServicio: (servicio) => {
  set({ servicio, pacientes: getPacientesPorServicio(servicio) })
  get().recalcularAsignaciones()  // ← recalculate after service change
},
```

**Default value in createDefaultGuarnicion:**
```typescript
function createDefaultGuarnicion(): PreparacionGuarnicion {
  return {
    // ... existing
    pacientesAsignados: 0,
  }
}
```

### src/components/calcular/GuarnicionSection.tsx

**Add index prop:**
```typescript
interface GuarnicionSectionProps {
  preparacionId: string
  index: number        // ← NEW
  totalGuarniciones: number  // ← NEW
}
```

**Header changes — replace current header block:**
- Show `prep.pacientesAsignados` and percentage
- Badge style: `bg-accent-light text-accent font-mono`
- Show: `"Guarnición {index+1} — {pacientesAsignados} pacientes ({pct}%)"`

**Store access for total:**
```typescript
const totalPacientes = useAppStore((s) =>
  Object.values(s.pacientes).reduce((a, b) => a + b, 0),
)
```

**Remove the current totalPacientes from handleCalculate check — use pacientesAsignados instead:**
The "Calcular" button disabled state checks `prep.pacientesAsignados === 0`

### src/pages/Calcular.tsx

**Modified add button:**
```typescript
{guarniciones.length < 3 && (
  <button onClick={() => addGuarnicion()} ...>
    <IconPlus /> Añadir otra guarnición
  </button>
)}
```

**Pass index to GuarnicionSection:**
```typescript
{guarniciones.map((g, i) => (
  <GuarnicionSection key={g.id} preparacionId={g.id} index={i} totalGuarniciones={guarniciones.length} />
))}
```

## Test plan

### New tests (calculos.test.ts)
- `calcularReparto` — 6 cases from spec
- Verify edge cases: 0 patients, 1 garnish, exact division

### Existing tests
- No changes to calcularGuarnicion tests
- calcularGuarnicion still accepts `totalPacientes` — functionally the same

## State after change

| File | Change |
|------|--------|
| `src/lib/calculos.ts` | +12 lines (calcularReparto) |
| `src/lib/calculos.test.ts` | +30 lines (6 new tests) |
| `src/store/useAppStore.ts` | ~15 lines modified |
| `src/components/calcular/GuarnicionSection.tsx` | ~20 lines modified |
| `src/pages/Calcular.tsx` | ~5 lines modified |
| **Total** | **~82 lines** |
