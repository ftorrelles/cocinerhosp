# Control de Roles Specification

## Purpose

Controlar el acceso a funcionalidades de la app según el rol del usuario: `chef`, `chef_jefe`, o `admin`.

## Requirements

### Requirement: Navegación según rol

El sistema DEBE mostrar diferentes tabs en el BottomNav según el rol del usuario autenticado.

#### Scenario: Chef ve tabs básicos

- GIVEN un usuario con rol `chef` autenticado
- WHEN se renderiza el BottomNav
- THEN ve 4 tabs: Calcular, Blandas, Registrar, Dashboard

#### Scenario: Chef_jefe ve tabs básicos

- GIVEN un usuario con rol `chef_jefe` autenticado
- WHEN se renderiza el BottomNav
- THEN ve 4 tabs: Calcular, Blandas, Registrar, Dashboard

#### Scenario: Admin ve tab extra de Usuarios

- GIVEN un usuario con rol `admin` autenticado
- WHEN se renderiza el BottomNav
- THEN ve 5 tabs: Calcular, Blandas, Registrar, Dashboard, Usuarios

### Requirement: Acceso a rutas según rol

El sistema DEBE restringir el acceso a `/usuarios` solo para usuarios con rol `admin`.

#### Scenario: Admin accede a usuarios

- GIVEN un usuario con rol `admin` autenticado
- WHEN navega a `/usuarios`
- THEN ve la pantalla de gestión de usuarios

#### Scenario: Chef_jefe no ve usuarios

- GIVEN un usuario con rol `chef_jefe` autenticado
- WHEN navega a `/usuarios` manualmente
- THEN es redirigido a `/` (o ve un mensaje de acceso denegado)
- AND el tab Usuarios NO aparece en su BottomNav

#### Scenario: Chef no ve usuarios

- GIVEN un usuario con rol `chef` autenticado
- WHEN navega a `/usuarios` manualmente
- THEN es redirigido a `/`
- AND el tab Usuarios NO aparece en su BottomNav

### Requirement: Perfil visible para todos

El sistema DEBE mostrar el ícono de perfil en el TopBar para todos los roles autenticados.

#### Scenario: Todos ven perfil

- GIVEN cualquier rol autenticado
- WHEN ve el TopBar
- THEN ve el ícono que lleva a `/perfil`

### Requirement: Dashboard filtrar según rol

El sistema DEBE mostrar el selector de chef en el dashboard SOLO para roles `admin` y `chef_jefe`.

#### Scenario: Admin/chef_jefe ven selector

- GIVEN un usuario con rol `admin` o `chef_jefe` autenticado
- WHEN ve la pantalla Dashboard
- THEN ve un selector de chef con opciones "Todos" + lista de chefs

#### Scenario: Chef no ve selector

- GIVEN un usuario con rol `chef` autenticado
- WHEN ve la pantalla Dashboard
- THEN NO ve el selector de chef
- AND ve solo sus propios datos
