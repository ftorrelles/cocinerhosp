# Gestión de Usuarios Specification

## Purpose

Permitir al administrador del sistema gestionar usuarios: listar, crear, activar/desactivar, y cambiar PIN de cualquier usuario.

## Requirements

### Requirement: Listar usuarios

El sistema DEBE mostrar una lista de todos los usuarios para el administrador en la pantalla `/usuarios`.

#### Scenario: Admin ve lista completa

- GIVEN un usuario con rol `admin` autenticado en `/usuarios`
- WHEN la pantalla se carga
- THEN el sistema llama a la RPC `listar_usuarios()`
- AND muestra una tabla/lista con nombre, username, rol, centro, estado (activo/inactivo) de cada usuario

#### Scenario: Lista vacía

- GIVEN un admin en `/usuarios`
- WHEN no hay usuarios registrados
- THEN muestra mensaje "No hay usuarios registrados"

### Requirement: Crear usuario

El sistema DEBE permitir al admin crear nuevos usuarios con un formulario.

#### Scenario: Creación exitosa

- GIVEN un admin en `/usuarios`
- WHEN completa el formulario con nombre completo, username, PIN inicial (4 dígitos), rol, y centro
- AND hace clic en "Guardar"
- THEN el sistema llama a la RPC `crear_usuario(p_nombre, p_username, p_pin, p_rol, p_centro_id)`
- AND el nuevo usuario aparece en la lista
- AND el formulario se cierra/limpia

#### Scenario: Username duplicado

- GIVEN un admin creando un usuario
- WHEN ingresa un username que ya existe
- THEN el sistema muestra error "El username ya está en uso"
- AND no crea el usuario

#### Scenario: PIN inválido

- GIVEN un admin creando un usuario
- WHEN ingresa un PIN que no tiene exactamente 4 dígitos numéricos
- THEN el sistema muestra error "El PIN debe tener 4 dígitos numéricos"
- AND no crea el usuario

### Requirement: Activar/Desactivar usuario

El sistema DEBE permitir al admin activar o desactivar usuarios sin borrarlos.

#### Scenario: Desactivar usuario

- GIVEN un admin en `/usuarios`
- WHEN hace clic en "Desactivar" en un usuario activo
- THEN el sistema llama a la RPC `toggle_usuario(p_usuario_id)`
- AND el usuario aparece como "Inactivo" en la lista
- AND el usuario no puede iniciar sesión

#### Scenario: Reactivar usuario

- GIVEN un admin en `/usuarios`
- WHEN hace clic en "Activar" en un usuario inactivo
- THEN el sistema llama a la RPC `toggle_usuario(p_usuario_id)`
- AND el usuario aparece como "Activo" en la lista
- AND el usuario puede iniciar sesión nuevamente

### Requirement: Admin cambia PIN de usuario

El sistema DEBE permitir al admin cambiar el PIN de cualquier usuario sin verificar el PIN actual.

#### Scenario: Cambio exitoso

- GIVEN un admin en `/usuarios`
- WHEN selecciona "Cambiar PIN" en un usuario
- AND ingresa un nuevo PIN de 4 dígitos
- THEN el sistema llama a la RPC `cambiar_pin_admin(p_usuario_id, p_pin_nuevo)`
- AND muestra mensaje "PIN actualizado correctamente"

#### Scenario: PIN no válido

- GIVEN un admin cambiando PIN de un usuario
- WHEN ingresa un PIN de menos/más de 4 dígitos o con letras
- THEN muestra error "El PIN debe tener exactamente 4 dígitos numéricos"
- AND no cambia el PIN
