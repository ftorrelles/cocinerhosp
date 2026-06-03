# Tasks: Fase 7 — Mejoras calculadora

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~430 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1: store + componentes (ProteinaSection, GuarnicionSection) → PR2: Calcular.tsx + cleanup |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Store refactor + ProteinaSection + GuarnicionSection con useState local | PR 1 | Base: main. Lógica completa, store nuevos tipos, fix del bug de inputs |
| 2 | Calcular.tsx con tabs + eliminar PlatoItem | PR 2 | Base: main (después de merge PR1). UI de pestañas, resultados inline |

## Phase 1: Store Refactor

- [ ] 1.1 `src/store/useAppStore.ts` — reemplazar tipo `Plato` por `PreparacionProteina[]` y `PreparacionGuarnicion[]`
- [ ] 1.2 Store — agregar acciones `add/remove/update/calcular` para cada tipo por separado
- [ ] 1.3 Store — agregar `tabActivo`, `setTab`, `resultadosProteinas`, `resultadosGuarniciones`
- [ ] 1.4 Store — mantener `ResultadoPlato` exportado para compatibilidad con ResultadoPlato.tsx
- [ ] 1.5 Store — eliminar `addPlato`, `removePlato`, `updatePlato`, `calcular` (combinado)

## Phase 2: Componentes de Preparación

- [ ] 2.1 `src/components/calcular/ProteinaSection.tsx` — refactor a standalone: useState local para inputs, sync onBlur a store, presets con chips, "＋Otro" para custom, botón Calcular inline
- [ ] 2.2 `src/components/calcular/GuarnicionSection.tsx` — mismo patrón que ProteinaSection: useState local, presets (arroz, macarrones, habichuelas...), "＋Otro", Calcular inline

## Phase 3: Integración / UI

- [ ] 3.1 `src/pages/Calcular.tsx` — reemplazar lista de PlatoItem por tabs (Proteína / Guarnición) con ServicioToggle + CentrosGrid compartidos arriba
- [ ] 3.2 `src/pages/Calcular.tsx` — loop de `ProteinaSection` en tab proteína, loop de `GuarnicionSection` en tab guarnición
- [ ] 3.3 `src/pages/Calcular.tsx` — eliminar imports de PlatoItem, ResultadoPlato, resultado global

## Phase 4: Cleanup

- [ ] 4.1 Eliminar `src/components/calcular/PlatoItem.tsx` (obsoleto)

## Verification

- [ ] 5.1 Verificar que los 12 tests de `src/lib/calculos.test.ts` sigan pasando
- [ ] 5.2 Verificar que no haya errores de TypeScript (`tsc --noEmit`)
- [ ] 5.3 Test manual: vaciar input numérico → se queda vacío hasta blur → restaura default
- [ ] 5.4 Test manual: múltiples preparaciones del mismo tipo → calcular individual funciona
