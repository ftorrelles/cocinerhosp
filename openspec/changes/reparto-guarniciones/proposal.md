# Proposal: reparto-guarniciones

## Problem
Cada guarnición calcula contra el 100% de los pacientes de forma independiente. Con 2 guarniciones para 414 pacientes, calcula 414 para cada una = 828 total, lo cual es incorrecto.

## Solution
Los pacientes se reparten automáticamente entre las guarniciones activas (máx 3):
- 1 guarnición: 100% pacientes
- 2 guarniciones: 50% cada una
- 3 guarniciones: ~33% cada una (primera absorbe sobrante)

## Files affected
- src/lib/calculos.ts — nueva función calcularReparto
- src/lib/calculos.test.ts — tests de reparto
- src/store/useAppStore.ts — pacientesAsignados + recálculo + límite 3
- src/components/calcular/GuarnicionSection.tsx — header con pacientes asignados
- src/pages/Calcular.tsx — límite 3 en botón añadir
