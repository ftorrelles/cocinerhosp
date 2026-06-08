# Proposal: fase-9-recetas-y-registro-rapido

## Intent

Agregar un sistema de recetas persistentes con escalado automático por pacientes y un botón de guardado rápido "Guardar como preparación" tras calcular. Además, limpiar el preset de Quiché de la calculadora de proteína porque ya no se sirve.

## Scope

### In Scope

1. **Quitar Quiché**: Eliminar del array `PROTEINA_PRESETS` y del render de chips en `ProteinaSection.tsx`
2. **Pestaña Recetas**: Nueva ruta `/recetas` con header compartido (ServicioToggle + CentrosGrid), lista de recetas desde Supabase como cards, formulario CRUD modal, auto-escalado de ingredientes según `total_pacientes / raciones_base`
3. **Guardar como preparación**: Botón en el resultado inline de ProteinaSection y GuarnicionSection que llama `useHistorial().addRegistro()` con el plato, raciones y servicio actuales

### Out of Scope

- Edición de recetas desde la calculadora (solo desde /recetas)
- Sincronización offline de recetas (requiere conexión)
- Categorías o etiquetado de recetas
- Exportación de recetas

## Capabilities

### New Capabilities

- `recetario`: CRUD de recetas con ingredientes y escalado automático por pacientes

### Modified Capabilities

- `calcular-produccion`: Eliminar preset Quiché; agregar botón "Guardar como preparación" en resultados inline

## Approach

1. **ProteinaPresets**: Borrar `{ nombre: 'Quiché', ... }` del array. El chip "＋Otro" sigue disponible para preparaciones personalizadas si hacen falta
2. **Supabase**: SQL ya creado en `supabase-recetas.sql` — tabla `recetas`, `receta_ingredientes`, y RPCs (`listar_recetas`, `crear_receta`, `editar_receta`, `eliminar_receta`, `obtener_receta`) con permisos por rol
3. **Hook**: `useRecetas.ts` — llama RPCs y expone `recetas`, `loading`, `error`, `createReceta`, `updateReceta`, `deleteReceta`
4. **Página Recetas.tsx**: Reusa `ServicioToggle` y `CentrosGrid` del header. Debajo: grid de cards con nombre, raciones, ingredientes, temperatura, tiempo. Modal para crear/editar. Selector de receta → muestra ingredientes escalados al total de pacientes del servicio
5. **BottomNav**: Agregar tab "Recetas" (admin/chef_jefe ven "Recetas"; chef también consulta pero sin CRUD)
6. **App.tsx**: Ruta `/recetas` dentro del ProtectedLayout
7. **Guardar en ProteinaSection/GuarnicionSection**: Si hay resultado, renderizar botón "Guardar como preparación" debajo del resultado. Al hacer clic, llamar `addRegistro({ plato: prep.nombre, servicio, raciones: totalPacientes })` y mostrar toast o badge de confirmación

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/data/proteinaPresets.ts` | Modified | Eliminar entrada Quiché |
| `src/components/calcular/ProteinaSection.tsx` | Modified | Chip Quiché ya no se renderiza; botón guardar en resultado |
| `src/components/calcular/GuarnicionSection.tsx` | Modified | Botón guardar en resultado |
| `src/hooks/useRecetas.ts` | New | Hook con RPCs de recetas |
| `src/pages/Recetas.tsx` | New | Página recetas con header, lista, modal CRUD, auto-escalado |
| `src/components/layout/BottomNav.tsx` | Modified | Tab "Recetas" (visible para todos los roles) |
| `src/App.tsx` | Modified | Ruta `/recetas` |
| `supabase-recetas.sql` | Reference | Ya ejecutado — documentar en proposal |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RPCs de recetas no ejecutados en Supabase | Medium | Documentar SQL requerido; verificar existencia al cargar |
| Chef sin permisos ve botón de crear/editar | Low | Validar rol en hook y en UI (ocultar botón si rol = chef) |
| Auto-escalado con raciones_base = 0 | Low | Validar > 0 antes de escalar; default 12 |

## Rollback Plan

Revert commits de esta fase. Quitar Quiché es un cambio trivial (agregar de vuelta el preset). La ruta /recetas nueva no rompe nada existente. El botón guardar es aditivo — sin él la calculadora funciona igual.

## Success Criteria

- [ ] Quiché ya no aparece en los chips de proteína
- [ ] Usuario ve pestaña "Recetas" en BottomNav y navega a `/recetas`
- [ ] Admin/chef_jefe puede crear, editar y eliminar recetas; chef solo consulta
- [ ] Al seleccionar receta, ingredientes se escalan por `total_pacientes / raciones_base`
- [ ] En calcular, al tener resultado, botón "Guardar como preparación" persiste el registro y muestra confirmación
