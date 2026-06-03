# Design: Fase 7 — Mejoras calculadora

## Technical Approach

Refactor the store from a single `Plato` type (proteína + 2 guarniciones combinadas) to two independent lists: `PreparacionProteina[]` and `PreparacionGuarnicion[]`. Each preparation becomes a self-contained card with local useState for inputs, sync to store on blur. Calcular page splits into two tabs with shared servicio/pacientes header.

## Architecture Decisions

### Decision: Store shape — listas separadas vs. lista polimórfica

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `PreparacionProteina[]` + `PreparacionGuarnicion[]` | Duplica acciones (add/remove/update/calcular para cada tipo) pero cada tipo tiene campos muy distintos (udsCaja vs. bolsaKg) | ✅ Elegido — tipos separados evitan uniones discriminadas complejas y validaciones condicionales |
| `Preparacion[]` con `type: 'proteina'|'guarnicion'` | Menos código repetido pero cada preparación requires type guards y manejo condicional de campos | ❌ Rechazado — los campos difieren demasiado, el overhead de type narrowing no vale la pena |

### Decision: Estado local en inputs (useState) + sync onBlur

| Option | Tradeoff | Decision |
|--------|----------|----------|
| useState local + onBlur → store | El campo nunca se autocompleta mientras el chef escribe. El store recibe valores limpios. | ✅ Elegido — corrige el bug actual donde `parseFloat("") || defaultValue` rellena al instante |
| Store como única fuente de verdad | Menos estado duplicado, pero cada keystroke dispara re-renders globales y el bug del autocompletado persiste | ❌ Rechazado — exactamente el bug actual |

### Decision: Resultado inline vs. pantalla separada

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Resultado inline debajo de cada preparación | El chef ve resultado inmediato sin scroll. Cada preparación es autónoma. | ✅ Elegido — mobile-first, menos navegación |
| ResultadoPlato separado al final | Un solo lugar para ver todos los resultados, pero requiere scroll y perdés contexto por preparación | ❌ Rechazado — más clicks, peor UX en mobile |

### Decision: Tabs dentro de Calcular.tsx vs. páginas separadas

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Tabs internas con tabActivo en store | ServicioToggle + CentrosGrid compartidos arriba. Un solo state de pacientes para ambas tabs. Ruteo no cambia. | ✅ Elegido — mínimo refactor de ruteo, estado compartido natural |
| /calcular/proteina y /calcular/guarnicion como rutas | Cada tab es una ruta real, pero duplica el header y el estado de servicio/pacientes necesita sincronización | ❌ Rechazado — overkill para dos vistas que comparten estado |

## Data Flow

```
useState(local) ──onBlur──► store.updateProteina() ──► store (PreparacionProteina[])
                                  │
                          tap "Calcular"
                                  │
                                  ▼
                      store.calcularProteinaPrep(id)
                                  │
                                  ▼
                      store.resultadosProteinas[id] ← ProteinaResult
                                  │
                                  ▼
                      Componente renderiza resultado inline
```

El flujo es idéntico para guarniciones con `calcularGuarnicionPrep` y `resultadosGuarniciones`.

Las funciones de cálculo (`calcularProteina`, `calcularGuarnicion`) son PURAS en `src/lib/calculos.ts` — la store solo las invoca con los parámetros correctos.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/store/useAppStore.ts` | Modify | Nuevos tipos `PreparacionProteina`, `PreparacionGuarnicion`. Eliminar `Plato`, `addPlato`, `removePlato`, `updatePlato`, `calcular` (combinado). Agregar `add/remove/update/calcular` por tipo. |
| `src/pages/Calcular.tsx` | Modify | Reemplazar lista de PlatoItem por tabs + loop de ProteinaSection/GuarnicionSection. Eliminar imports de PlatoItem, ResultadoPlato, resultado global. |
| `src/components/calcular/ProteinaSection.tsx` | Modify | Standalone card: presets + ＋Otro + inputs locales + Calcular + resultado inline. Recibe `preparacionId` como prop. |
| `src/components/calcular/GuarnicionSection.tsx` | Modify | Standalone card: presets + ＋Otro + inputs locales + Calcular + resultado inline. Recibe `preparacionId` como prop. |
| `src/components/calcular/PlatoItem.tsx` | Delete | Obsoleto — reemplazado por ProteinaSection/GuarnicionSection independientes. |
| `src/components/calcular/ResultadoPlato.tsx` | Keep (unused) | Se puede eliminar en cleanup posterior. La interfaz `ResultadoPlato` se mantiene exportada para compatibilidad. |

## Interfaces / Contracts

Nuevos tipos en store:

```typescript
interface PreparacionProteina {
  id: string
  nombre: string
  unidadesPorCaja: number
  unidadesPorRacion: number
  nombreUnidad: string
  merma: number
  mermaAuto: boolean
  mermaSource: string
}

interface PreparacionGuarnicion {
  id: string
  nombre: string
  bolsaKg: number
  merma: number
  mermaAuto: boolean
  mermaSource: string
  gramos: number
}
```

Nuevas acciones en store:

```typescript
addProteina(preset?: Partial<PreparacionProteina>): void
removeProteina(id: string): void
updateProteina(id: string, changes: Partial<PreparacionProteina>): void
calcularProteinaPrep(id: string): void
// mismas para guarnición
```

Props de componentes:

```typescript
// ProteinaSection.tsx
interface ProteinaSectionProps {
  preparacionId: string
}
// GuarnicionSection.tsx — mismo patrón
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Store | Nuevas acciones add/remove/update/calcular | Tests de integración con Zustand (crear store, ejecutar acciones, verificar estado) |
| Componentes | ProteinaSection con preset, custom, calcular | React Testing Library — mock store, verificar render y eventos |
| Bug fix | Input no se autocompleta al vaciar | Test manual: abrir app, vaciar campo, verificar que quede vacío hasta blur |

## Migration / Rollout

Pr差分 > 400 líneas → PR1 (store + componentes lógica) y PR2 (Calcular.tsx con tabs). Ambos PRs targetean main secuencialmente.

No migration required — la store se refactoriza completa, no hay datos persistentes que migrar.

## Pr差分 Budget

- Store: ~100 líneas (nuevos tipos + acciones)
- ProteinaSection refactor: ~150 líneas
- GuarnicionSection refactor: ~120 líneas
- Calcular tabs: ~60 líneas
- **Total estimado: ~430 líneas** → riesgo de exceder 400. Se divide en PR1 (store + ProteinaSection + GuarnicionSection) y PR2 (Calcular.tsx con tabs + cleanup).
