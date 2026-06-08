# Calcular Producción — Specification

## Purpose

Calcular la cantidad de insumos (proteínas y guarniciones) necesarios para producir las raciones de un servicio, dados los pacientes por centro. Los cálculos usan fórmulas de merma, absorción y unitarización desde `src/lib/calculos.ts`.

## Requirements

### Requirement: Seleccionar servicio y editar pacientes

The system MUST allow the user to select between "Almuerzo" and "Cena". When the service changes, the system MUST update patient counts to the defaults for that service. The user MAY edit individual patient counts per center.

#### Scenario: Cambiar servicio actualiza pacientes

- GIVEN the user is on Calcular with Almuerzo selected (Sur=120, Candelaria=120, ...)
- WHEN the user taps "Cena"
- THEN patient counts update to Cena defaults (Sur=120, Candelaria=30, ...)

#### Scenario: Editar pacientes individualmente

- GIVEN Calcular page loaded
- WHEN the user changes Sur from 120 to 80
- THEN Sur shows 80 and total changes accordingly

### Requirement: Preparaciones independientes por pestaña

The system MUST display two tabs: "Proteína" and "Guarnición". Each tab SHALL show an independent list of preparations of that type. The service selector and patient editor SHALL remain visible above the tabs regardless of which tab is active.
(Previously: Single combined Plato with proteína + up to 2 guarniciones)

#### Scenario: Cambiar entre pestañas

- GIVEN the user is on Calcular with 2 proteína preparations
- WHEN the user taps the "Guarnición" tab
- THEN the guarnición preparations are shown
- AND the service selector and patient counts remain unchanged

#### Scenario: Múltiples preparaciones del mismo tipo

- GIVEN the user is on the Proteína tab
- WHEN the user adds "Albóndigas" and "Muslo pollo"
- THEN both appear as separate cards in the Proteína tab

### Requirement: Botón "Calcular" por preparación

Each preparation MUST have its own "Calcular" button. The system SHALL calculate only that preparation when tapped, without affecting other preparations.
(Previously: Single "Calcular" button at page bottom computed all combined)

#### Scenario: Calcular una proteína entre varias

- GIVEN 2 proteína preparations (Albóndigas and Muslo pollo)
- WHEN the user taps "Calcular" only on Albóndigas
- THEN the result for Albóndigas is shown inline
- AND Muslo pollo still shows no result

#### Scenario: Botón deshabilitado sin pacientes

- GIVEN 0 total patients
- WHEN viewing any preparation
- THEN its "Calcular" button is disabled

### Requirement: Resultado inline por preparación

Each preparation MUST display its result inline below its "Calcular" button. The result SHALL show: cajas a abrir, unidades disponibles, unidades necesarias, and sobrante for proteína; bolsas, bruto, neto, and sobrante for guarnición.
(Previously: Results displayed in separate ResultadoPlato component)

#### Scenario: Resultado inline tras calcular

- GIVEN 414 patients and an albóndigas preparation
- WHEN the user taps "Calcular"
- THEN a result section appears below the button showing cajas=40, sobrante, etc.

### Requirement: Inputs con estado local, sync en blur

Each numeric input SHALL use local `useState` while the user is editing. The system MUST NOT overwrite the input value or auto-fill it while the user is typing. On blur, the value SHALL sync to the store. If the value is empty on blur, the system SHALL restore a default value.
(Previously: Store updated on each keystroke, `parseFloat("") || defaultValue` caused auto-fill)

#### Scenario: Vaciar campo sin autocompletado inmediato

- GIVEN a preparation with merma=25%
- WHEN the user clears the merma field
- THEN the field stays empty (no auto-fill) while focused
- AND on blur, the field restores to 0

#### Scenario: Escribir nuevo valor

- GIVEN a preparation with udsCaja=52
- WHEN the user clears the field
- AND types "40"
- THEN the field shows "40" with no intermediate auto-complete

### Requirement: Chip "＋Otro" para preparaciones personalizadas

Each tab MUST show preset chips plus a trailing "＋Otro" chip. The preset chips SHALL NOT include Quiché. When tapped, "＋Otro" SHALL expand a custom form with empty fields where the user can define a fully custom preparation.
(Previously: Quiché was included as a preset chip; removed because it is no longer served)

#### Scenario: Agregar proteína personalizada

- GIVEN the user is on the Proteína tab
- WHEN the user taps "＋Otro"
- THEN a custom form appears with empty name, udsCaja, udsRacion, nomUnidad, and merma fields
- AND the preset chips are replaced by the custom form

### Requirement: Botón "Guardar como preparación" en resultado inline

After a calculation result is displayed, the system MUST show a "Guardar como preparación" button below the result. When tapped, the system MUST persist the preparation to the historial using `useHistorial().addRegistro()` with the preparation name, current service, and total patient count, then display a confirmation "Preparación guardada ✓" without redirecting.

#### Scenario: Guardar preparación desde proteína

- GIVEN the user calculated Albóndigas with 414 patients showing the result
- WHEN the user taps "Guardar como preparación"
- THEN the system calls `addRegistro({ plato: 'Albóndigas', servicio: 'Almuerzo', raciones: 414 })`
- AND shows "Preparación guardada ✓" inline

#### Scenario: Guardar preparación desde guarnición

- GIVEN the user calculated Habichuelas with 324 patients showing the result
- WHEN the user taps "Guardar como preparación"
- THEN the system persists with correct plato, servicio and raciones

#### Scenario: Botón oculto sin resultado

- GIVEN the user has not calculated yet
- THEN the "Guardar como preparación" button is not shown

#### Scenario: Botón usa el nombre de la preparación

- GIVEN a custom preparation named "Ensalada especial" with a result
- THEN the button uses "Ensalada especial" as the plato value

## Notes

- Preparations are independent: `PreparacionProteina[]` and `PreparacionGuarnicion[]` in the store
- Inputs use local useState + sync to store on blur (fixes previous auto-fill bug)
- Each preparation has its own Calcular button and inline result
- Service selector and patient editor are shared across both tabs
- Old `Plato` type, `PlatoItem.tsx`, and `ResultadoPlato.tsx` have been removed
