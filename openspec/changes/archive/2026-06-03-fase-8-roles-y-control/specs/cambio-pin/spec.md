# Cambio de PIN Specification

## Purpose

Permitir a cualquier usuario autenticado cambiar su PIN de acceso desde la app, verificando el PIN actual por seguridad.

## Requirements

### Requirement: Cambiar PIN

El sistema DEBE permitir a cualquier usuario autenticado cambiar su PIN desde la pantalla `/perfil`.

#### Scenario: Cambio exitoso

- GIVEN un usuario autenticado en la pantalla `/perfil`
- WHEN ingresa PIN actual correcto, PIN nuevo de 4 dígitos, y confirmación coincide
- THEN el sistema llama a la RPC `cambiar_pin(p_usuario_id, p_pin_actual, p_pin_nuevo)`
- AND muestra mensaje "PIN actualizado correctamente"
- AND limpia los campos del formulario

#### Scenario: PIN actual incorrecto

- GIVEN un usuario autenticado en `/perfil`
- WHEN ingresa un PIN actual incorrecto
- THEN el sistema muestra error "El PIN actual no es correcto"
- AND no cambia el PIN

#### Scenario: PIN nuevo no coincide con confirmación

- GIVEN un usuario autenticado en `/perfil`
- WHEN PIN nuevo y confirmación no coinciden
- THEN el sistema muestra error "Los PIN nuevos no coinciden"
- AND no cambia el PIN

#### Scenario: PIN nuevo no tiene 4 dígitos

- GIVEN un usuario autenticado en `/perfil`
- WHEN PIN nuevo tiene menos o más de 4 dígitos, o contiene letras
- THEN el sistema muestra error "El PIN debe tener exactamente 4 dígitos numéricos"
- AND no cambia el PIN

#### Scenario: Acceso sin autenticación

- GIVEN un usuario no autenticado
- WHEN intenta acceder a `/perfil`
- THEN el sistema redirige a `/login`

### Requirement: Acceso a pantalla Perfil

El sistema DEBE mostrar un ícono de acceso a `/perfil` en el TopBar para todos los roles autenticados.

#### Scenario: Icono visible

- GIVEN cualquier usuario autenticado (chef, chef_jefe, admin)
- WHEN ve el TopBar
- THEN ve un ícono de engranaje o usuario que navega a `/perfil`
