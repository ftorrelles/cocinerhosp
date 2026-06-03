# Delta for Dashboard Métricas

## ADDED Requirements

### Requirement: Filtro por chef en dashboard

El sistema DEBE mostrar un selector de chef en el dashboard cuando el usuario tiene rol `admin` o `chef_jefe`.

#### Scenario: Admin selecciona chef específico

- GIVEN un admin autenticado en el dashboard
- WHEN selecciona un chef específico del selector
- THEN el dashboard muestra métricas y registros solo de ese chef
- AND `useDashboard` recibe el `usuarioId` del chef seleccionado

#### Scenario: Admin selecciona "Todos"

- GIVEN un admin autenticado en el dashboard
- WHEN selecciona "Todos" en el selector
- THEN el dashboard muestra métricas agregadas de todos los chefs
- AND `useDashboard` recibe `usuarioId: null`

#### Scenario: Chef_jefe filtra dashboard

- GIVEN un chef_jefe autenticado en el dashboard
- WHEN ve el dashboard
- THEN ve el mismo selector de chef que admin
- AND puede filtrar igual que admin

#### Scenario: Chef no ve selector

- GIVEN un chef autenticado en el dashboard
- WHEN ve el dashboard
- THEN NO ve el selector de chef
- AND ve solo sus propios datos

### Requirement: Cargar lista de chefs

El sistema DEBE cargar la lista de chefs para poblar el selector.

#### Scenario: Selector se puebla

- GIVEN un admin/chef_jefe en el dashboard
- WHEN el dashboard se carga
- THEN el sistema obtiene la lista de usuarios activos con rol `chef` y `chef_jefe`
- AND el selector muestra "Todos" como opción por defecto + cada chef por nombre
