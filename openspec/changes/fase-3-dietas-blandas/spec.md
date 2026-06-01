# Spec: fase-3-dietas-blandas

## Pantalla Dietas Blandas

### Header
- Título "Dietas Blandas" con ícono de cuchara/cocina
- Subtítulo: "Producción fija diaria"
- Breakcrumb visual: "48 bolsas congeladas / día" en badge verde

### Card 1: Chinos (Triturados)
- Header: "Chinos — 22 barquetas × 3 kg = 66 kg/día"
- Tabla con columnas: Tipo, Ingredientes, Bolsas, Bruto total
- 3 filas: Zanahoria (2 papa + 2 zanahoria → 4 bolsas → 10 kg), Calabaza (2 papa + 2 calabaza → 4 → 10 kg), Calabacín (3 papa + 2 calabacín → 5 → 12.5 kg)
- Estilo: filas alternadas, números en DM Mono

### Card 2: Molido (Caldo Espesado)
- Header: "Molido — 20 barquetas × 3 kg = 60 kg/día"
- Lista de ingredientes con cantidad:
  - Calabacín congelado: 2 bolsas (5 kg)
  - Zanahoria congelada: 1 bolsa (2.5 kg)
  - Cebolla fresca: ~1 kg
  - Pimiento fresco: ~1 kg
  - Ajo: ~100 g
  - Cilantro: ~50 g
  - Fécula de maíz: ~400 g
  - Agua/caldo: hasta 60 kg
- Sección de proteína variable (con toggle o nota):
  - Pollo: 8.6 kg bruto
  - Cerdo: 7.3 kg bruto

### Card 3: Puré de Papas
- Header: "Puré de papas — 22 barquetas × 3 kg = 66 kg/día"
- Tabla: Ingrediente, Cantidad
  - Papas congeladas (2.5 kg/bolsa): 32 bolsas (80 kg)
  - Merma 15%: −12 kg
  - Papa cocida disponible: ~68 kg
- Nota al pie: "Sal + aceite al gusto (~300-400 ml aceite)"

### Card 4: Resumen
- Badge grande: "48 bolsas congeladas / día"
- Desglose: Papas (39), Zanahoria (3), Calabaza (2), Calabacín (4)
- Total bolsas: 48

### Estilos
- Misma paleta que el resto de la app: `#F4F3EF` fondo, surface white cards
- Headers con ícono 17px + título semibold
- Números en DM Mono
- Mobile-first, single column
