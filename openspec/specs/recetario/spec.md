# Recetario — Specification

## Purpose

Permitir a los chefs consultar, crear, editar y eliminar recetas persistentes con escalado automático de ingredientes según el total de pacientes del servicio. Las recetas se almacenan en Supabase y el acceso de escritura está restringido a roles `admin` y `chef_jefe`.

## Requirements

### Requirement: Pestaña Recetas en navegación

El sistema DEBE mostrar una pestaña "Recetas" en la BottomNav que navegue a `/recetas`. La pestaña DEBE ser visible para todos los roles (admin, chef_jefe, chef).

#### Scenario: Navegar a recetas

- GIVEN un usuario autenticado en la app
- WHEN toca la pestaña "Recetas" en la BottomNav
- THEN el sistema navega a `/recetas`
- AND el header muestra ServicioToggle y CentrosGrid

### Requirement: Header compartido con ServicioToggle y CentrosGrid

La página `/recetas` DEBE reutilizar los mismos componentes `ServicioToggle` y `CentrosGrid` que la calculadora, permitiendo seleccionar servicio y editar pacientes por centro.

#### Scenario: Cambiar servicio en recetas

- GIVEN el usuario en `/recetas`
- WHEN cambia el servicio de Almuerzo a Cena
- THEN los pacientes por centro se actualizan a los valores por defecto de Cena
- AND los ingredientes escalados se recalculan si hay una receta seleccionada

### Requirement: Lista de recetas como cards

El sistema DEBE mostrar las recetas activas como una grilla de cards. Cada card DEBE mostrar: nombre, raciones_base, lista de ingredientes, temperatura, y tiempo.

#### Scenario: Cargar lista de recetas

- GIVEN el usuario navega a `/recetas`
- WHEN la página se carga
- THEN el sistema llama a la RPC `listar_recetas()`
- AND muestra las recetas como cards en una grilla

#### Scenario: Lista vacía

- GIVEN el usuario en `/recetas`
- WHEN no hay recetas activas en Supabase
- THEN el sistema muestra el mensaje "No hay recetas guardadas"
- AND el botón "＋ Nueva receta" sigue visible para admin/chef_jefe

### Requirement: Botón crear receta restringido por rol

El sistema DEBE mostrar el botón "＋ Nueva receta" solo cuando el usuario autenticado tiene rol `admin` o `chef_jefe`. Si el rol es `chef`, el botón NO DEBE mostrarse.

#### Scenario: Admin ve botón crear

- GIVEN un usuario con rol `admin` en `/recetas`
- WHEN la lista de recetas se renderiza
- THEN el botón "＋ Nueva receta" aparece en la parte superior de la grilla

#### Scenario: Chef no ve botón crear

- GIVEN un usuario con rol `chef` en `/recetas`
- WHEN la lista de recetas se renderiza
- THEN el botón "＋ Nueva receta" NO se muestra
- AND el chef puede consultar todas las recetas sin opciones de edición

### Requirement: Crear receta con modal

El sistema DEBE abrir un modal al hacer clic en "＋ Nueva receta". El modal DEBE contener: nombre, raciones_base, temperatura, tiempo, notas, y una lista dinámica de ingredientes (nombre, cantidad, unidad, orden). Solo admin/chef_jefe pueden guardar.

#### Scenario: Crear receta exitosa

- GIVEN un admin en `/recetas`
- WHEN hace clic en "＋ Nueva receta"
- THEN se abre un modal con campos vacíos
- AND completa nombre="Pollo asado", raciones_base=12, temperatura="180°C", tiempo="45 min"
- AND agrega 3 ingredientes con nombre, cantidad, unidad y orden
- WHEN hace clic en "Guardar"
- THEN el sistema llama a la RPC `crear_receta()` con los datos
- AND la nueva receta aparece en la lista
- AND el modal se cierra

#### Scenario: Validar campos requeridos

- GIVEN un admin con el modal de nueva receta abierto
- WHEN intenta guardar sin completar nombre
- THEN el sistema muestra error "El nombre es obligatorio"
- AND no guarda la receta

#### Scenario: Chef no puede abrir modal

- GIVEN un chef en `/recetas`
- WHEN intenta acceder al modal de crear receta
- THEN el botón "＋ Nueva receta" no está disponible
- AND el sistema no muestra el modal

### Requirement: Editar receta con modal

El sistema DEBE permitir a admin/chef_jefe editar cualquier receta existente. El modal DEBE cargar los datos actuales de la receta y sus ingredientes. Solo admin/chef_jefe pueden guardar cambios.

#### Scenario: Editar receta existente

- GIVEN un admin en `/recetas`
- WHEN hace clic en "Editar" en una card de receta
- THEN se abre el modal con los datos actuales de la receta
- WHEN modifica nombre y agrega/quita ingredientes
- AND hace clic en "Guardar"
- THEN el sistema llama a la RPC `editar_receta()` con los datos
- AND la card se actualiza con los nuevos valores
- AND el modal se cierra

### Requirement: Eliminar receta con confirmación

El sistema DEBE permitir a admin/chef_jefe eliminar recetas con soft delete (activo = false). El sistema DEBE mostrar un diálogo de confirmación antes de eliminar.

#### Scenario: Eliminar receta

- GIVEN un admin en `/recetas`
- WHEN hace clic en "Eliminar" en una card de receta
- THEN el sistema muestra confirmación "¿Eliminar receta [nombre]?"
- AND opciones "Cancelar" y "Eliminar"
- WHEN el admin confirma "Eliminar"
- THEN el sistema llama a la RPC `eliminar_receta()`
- AND la receta desaparece de la lista
- AND muestra mensaje "Receta eliminada"

#### Scenario: Cancelar eliminación

- GIVEN un admin en `/recetas`
- WHEN hace clic en "Eliminar" en una card
- AND luego hace clic en "Cancelar" en el diálogo de confirmación
- THEN la receta permanece visible en la lista
- AND no se llama a ninguna RPC

### Requirement: Escalado automático de ingredientes

Cuando el usuario selecciona o visualiza una receta, el sistema DEBE escalar las cantidades de cada ingrediente multiplicándolas por `total_pacientes / raciones_base`. Si `raciones_base` es 0, el sistema NO DEBE escalar.

#### Scenario: Escalar ingredientes

- GIVEN una receta con raciones_base=12 e ingrediente "Pollo" cantidad=2kg
- WHEN el usuario selecciona la receta con total_pacientes=414
- THEN el sistema calcula factor = 414 / 12 = 34.5
- AND muestra ingrediente "Pollo" con cantidad escalada = 2 × 34.5 = 69kg

#### Scenario: Raciones base inválida

- GIVEN una receta con raciones_base=0
- WHEN el usuario selecciona la receta
- THEN el sistema muestra los ingredientes sin escalar
- AND no divide por cero

### Requirement: Edición temporal sin persistencia

El usuario DEBE poder modificar temporalmente valores de la receta en pantalla (raciones, ingredientes) sin que los cambios se guarden en la base de datos. Los valores originales en Supabase NO DEBEN modificarse hasta que admin/chef_jefe use el modal de edición.

#### Scenario: Modificar valores temporalmente

- GIVEN el usuario visualizando una receta con ingredientes escalados
- WHEN el usuario cambia un valor de cantidad en pantalla
- THEN el valor cambia localmente en la UI
- AND no se llama a ninguna RPC
- AND al recargar la página, los valores originales se restauran

### Requirement: Consulta sin autenticación de escritura

Todos los usuarios autenticados (admin, chef_jefe, chef) DEBEN poder consultar cualquier receta de la lista y ver sus ingredientes escalados. Solo admin y chef_jefe DEBEN poder crear, editar o eliminar recetas.

#### Scenario: Chef consulta receta

- GIVEN un chef autenticado en `/recetas`
- WHEN hace clic en una card de receta para ver detalles
- THEN el sistema muestra los ingredientes escalados al total de pacientes del servicio actual
- AND no se muestran botones de Editar, Eliminar ni ＋ Nueva receta

### Requirement: Botón "Guardar como preparación" con categoría receta

When the user visualises a recipe with scaled ingredients and an active result, the system MUST show a "Guardar como preparación" button. When tapped, the system MUST persist the recipe as a preparation in the historial using `useHistorial().addRegistro()` with `categoria='receta'`, the recipe name as `plato`, current service, and current total patient count, then display a confirmation "Preparación guardada ✓" without redirecting.

#### Scenario: Guardar receta como preparación

- GIVEN the user is on `/recetas` viewing "Pollo asado" with 414 patients and scaled ingredients shown
- WHEN the user taps "Guardar como preparación"
- THEN the system calls `addRegistro({ plato: 'Pollo asado', servicio: 'Almuerzo', raciones: 414, categoria: 'receta' })`
- AND shows "Preparación guardada ✓" inline

#### Scenario: Botón oculto cuando no hay receta seleccionada

- GIVEN the user is on `/recetas` with no recipe selected or visualised
- THEN the "Guardar como preparación" button is NOT shown

#### Scenario: Botón usa el nombre de la receta

- GIVEN the user is viewing recipe "Merluza al horno" with scaled ingredients
- WHEN the user taps "Guardar como preparación"
- THEN the `plato` value sent is 'Merluza al horno'
