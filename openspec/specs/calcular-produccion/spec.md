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

### Requirement: Gestionar un Plato combinado

The system MUST allow the user to manage a single "Plato" that contains one proteína and up to two guarniciones. The user SHALL add, edit, and remove this plato.

#### Scenario: Seleccionar proteína por preset

- GIVEN Calcular page with no plato
- WHEN the user taps "Albóndigas" in ProteínaSection
- THEN plato.nombre = "Albóndigas", plato.unidadesPorCaja = 52, plato.unidadesPorRacion = 5

#### Scenario: Editar campos de proteína

- GIVEN a plato with proteína selected
- WHEN the user changes the merma input
- THEN the plato updates immediately on each keystroke

#### Scenario: Configurar primera guarnición

- GIVEN a plato with proteína
- WHEN the user selects "Arroz" in the first guarnición slot
- THEN guarnicion1 data is set with arroz defaults

#### Scenario: Configurar segunda guarnición

- GIVEN a plato with first guarnición set
- WHEN the user selects "Habichuelas" in the second guarnición slot
- THEN guarnicion2 data is set

### Requirement: Calcular el plato completo

The single "Calcular" button at the bottom of the page MUST compute the result for proteína, guarnición1, and guarnición2 together, displaying them in a separate ResultadoPlato component.

#### Scenario: Calcular plato con proteína y 1 guarnición

- GIVEN a plato with proteína (albóndigas: caja=52, racion=5) and guarnición (habichuelas: merma=22%, 120g)
- WHEN the user taps "Calcular"
- THEN the result shows proteína cajas=40 AND guarnición bolsas=4

#### Scenario: Calcular sin pacientes

- GIVEN 0 total patients
- WHEN the user taps "Calcular"
- THEN no calculation is performed

### Requirement: Inputs numéricos con autocompletado inmediato

The system UPDATES the store on each keystroke. When the user clears a numeric field, the system immediately fills it with a default value because the parsing formula `parseFloat("") || defaultValue` treats empty string as falsy.

#### Scenario: Autocompletado al vaciar campo de merma

- GIVEN a guarnición with merma=22%
- WHEN the user clears the merma input
- THEN the field immediately shows 20 (the default) instead of remaining empty

#### Scenario: Autocompletado al vaciar campo de gramos

- GIVEN a guarnición with gramos=120
- WHEN the user clears the gramos input
- THEN the field immediately shows 60 instead of remaining empty

## Notes

- The current implementation uses a single `Plato` type that combines proteína + 2 guarniciones
- Store mutations happen on every keystroke (`onChange` sync), not on blur
- Results are shown in a separate `ResultadoPlato` component, not inline
- The `PlatoItem.tsx` component handles the full plato presentation
