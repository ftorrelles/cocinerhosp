# Delta for Calcular Producción

## REMOVED Requirements

### Requirement: Quiché preset in proteína presets

El sistema YA NO DEBE incluir el preset `Quiché` en el array `PROTEINA_PRESETS`. El chip Quiché NO DEBE renderizarse en `ProteinaSection.tsx`.
(Reason: Quiché ya no se sirve en el comedor.)
(Migration: Eliminar la entrada `{ nombre: 'Quiché', ... }` del array `PROTEINA_PRESETS` en `src/data/proteinaPresets.ts`. El chip "＋Otro" sigue disponible para preparaciones personalizadas.)

## ADDED Requirements

### Requirement: Botón "Guardar como preparación" en resultado inline

El sistema DEBE mostrar un botón "Guardar como preparación" debajo del resultado inline de cada preparación (proteína y guarnición) después de calcular. Al hacer clic, el sistema DEBE persistir la preparación en el historial y mostrar confirmación visual, sin redirigir.

#### Scenario: Guardar preparación de proteína

- GIVEN el usuario calculó Albóndigas para Almuerzo con 414 pacientes
- WHEN el resultado inline muestra cajas=40, sobrante, etc.
- THEN un botón "Guardar como preparación" aparece debajo del resultado
- WHEN el usuario hace clic en el botón
- THEN el sistema llama a `useHistorial().addRegistro({ plato: 'Albóndigas', servicio: 'Almuerzo', raciones: 414 })`
- AND muestra confirmación "Preparación guardada ✓"
- AND el resultado inline permanece visible

#### Scenario: Guardar preparación de guarnición

- GIVEN el usuario calculó Habichuelas para Cena con 324 pacientes
- WHEN el resultado inline muestra bolsas=4, bruto, neto
- THEN un botón "Guardar como preparación" aparece debajo del resultado
- WHEN el usuario hace clic en el botón
- THEN el sistema llama a `useHistorial().addRegistro({ plato: 'Habichuelas', servicio: 'Cena', raciones: 324 })`
- AND muestra confirmación "Preparación guardada ✓"

#### Scenario: Botón oculto sin resultado

- GIVEN el usuario no ha calculado ninguna preparación
- WHEN ve la sección Proteína o Guarnición
- THEN el botón "Guardar como preparación" NO se muestra
- AND solo aparece después de tener un resultado inline

#### Scenario: Botón usa el nombre de la preparación

- GIVEN el usuario creó una preparación personalizada con "＋Otro" llamada "Ensalada especial"
- WHEN calcula y ve el resultado inline
- THEN el botón "Guardar como preparación" usa "Ensalada especial" como valor de `plato`
- AND guarda con ese nombre en el historial
