# Delta for Calcular Producción

## ADDED Requirements

### Requirement: Preparaciones independientes por pestaña

The system MUST display two tabs: "Proteína" and "Guarnición". Each tab SHALL show an independent list of preparations of that type. The service selector and patient editor SHALL remain visible above the tabs regardless of which tab is active.

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

#### Scenario: Resultado inline tras calcular

- GIVEN 414 patients and an albóndigas preparation
- WHEN the user taps "Calcular"
- THEN a result section appears below the button showing cajas=40, sobrante, etc.

### Requirement: Inputs con estado local, sync en blur

Each numeric input SHALL use local `useState` while the user is editing. The system MUST NOT overwrite the input value or auto-fill it while the user is typing. On blur, the value SHALL sync to the store. If the value is empty on blur, the system SHALL restore a default value.

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

Each tab MUST show preset chips plus a trailing "＋Otro" chip. When tapped, "＋Otro" SHALL expand a custom form with empty fields where the user can define a fully custom preparation.

#### Scenario: Agregar proteína personalizada

- GIVEN the user is on the Proteína tab
- WHEN the user taps "＋Otro"
- THEN a custom form appears with empty name, udsCaja, udsRacion, nomUnidad, and merma fields
- AND the preset chips are replaced by the custom form

## MODIFIED Requirements

### Requirement: Calcular el plato completo → No aplica, eliminado

This requirement is replaced by "Calcular por preparación individual". There is no longer a single combined calculation.
(Previously: One "Calcular" button computed proteína + 2 guarniciones together)

#### Scenario: Calcular plato completo → Replaced by individual calculation per preparation

The previous combined calculation scenario is replaced by individual per-preparation scenarios.

## REMOVED Requirements

### Requirement: Gestionar un Plato combinado

(Reason: Replaced by independent preparations per tab. The combined Plato type is removed from the store and UI. Multiple independent preparations replace the single plato with 2 guarnición slots.)

### Requirement: Inputs numéricos con autocompletado inmediato

(Reason: This was a bug. The new behavior uses local useState + sync on blur, so inputs stay empty while editing and restore defaults only on blur.)
