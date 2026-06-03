# Proposal: fase-7-mejoras-calculadora

## Intent

Refactorizar la pantalla Calcular para separar proteínas y guarniciones en pestañas independientes, cada una con múltiples preparaciones editables. Corregir bug de inputs que se autocompletan al vaciarlos.

## Scope

### In Scope
- Dos pestañas internas "Proteína" / "Guarnición" en Calcular
- ServicioToggle + CentrosGrid compartidos arriba
- Múltiples preparaciones por pestaña (añadir/eliminar)
- Chip "＋ Otro" para preparación personalizada en ambos grupos
- Botón "Calcular" por preparación (no auto-cálculo)
- Bug fix: inputs con useState local, sync onBlur al store
- Resultado inline debajo de cada preparación
- Eliminar PlatoItem.tsx (obsoleto)

### Out of Scope
- Segunda guarnición (cada guarnición es independiente)
- Cálculo automático al cambiar inputs

## Capabilities

### Modified Capabilities
- `calcular-produccion`: separado en tabs proteína/guarnición, múltiples preparaciones

## Approach

Store refactor: nuevos tipos `PreparacionProteina` y `PreparacionGuarnicion`. Inputs con estado local en los componentes, sincronizan al store en onBlur o al presionar Calcular. Resultado se calcula por preparación individual.

Si el diff excede 400 líneas, se divide en PRs encadenados:
- PR1: Store + tipos + lógica de cálculo individual
- PR2: Componentes UI (pestañas, secciones, resultados)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/store/useAppStore.ts` | Modified | Nuevos tipos, eliminar Plato, calcular individual |
| `src/pages/Calcular.tsx` | Modified | Pestañas, listas separadas |
| `src/components/calcular/ProteinaSection.tsx` | Modified | Standalone, useState local, ＋Otro |
| `src/components/calcular/GuarnicionSection.tsx` | Modified | Standalone, useState local, ＋Otro |
| `src/components/calcular/PlatoItem.tsx` | Removed | Obsoleto |

## Risks

| Risk | Mitigation |
|------|------------|
| Diff > 400 líneas | Dividir en PRs encadenados (store → UI) |
| Bug inputs no resuelto | Test manual: vaciar cada campo, verificar que no se autocomplete |

## Dependencies

- Ninguna

## Success Criteria

- [ ] Pestaña Proteína muestra lista de preparaciones con presets + "＋Otro"
- [ ] Pestaña Guarnición muestra lista de preparaciones con presets + "＋Otro"
- [ ] Cada preparación tiene su botón "Calcular" individual
- [ ] Inputs permiten borrar completamente y escribir libremente
- [ ] Al hacer blur en campo vacío, restaura valor por defecto
- [ ] Sin errores de TypeScript
