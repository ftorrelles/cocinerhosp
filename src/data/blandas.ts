// ── Dietas Blandas — Producción Fija Diaria ──
// Fuente: PRD sección 1.6

export interface Chino {
  tipo: string
  ingredientes: string
  bolsas: number
  brutoKg: number
}

export interface MolidoIngrediente {
  nombre: string
  cantidad: string
}

export interface MolidoProteina {
  tipo: string
  kgBruto: number
}

export interface PureData {
  bolsasPapa: number
  kgBruto: number
  mermaP: number
  mermaKg: number
  papaCocidaKg: number
}

export interface ResumenBolsas {
  papas: number
  zanahoria: number
  calabaza: number
  calabacin: number
  total: number
}

// ── Chinos (triturados) ──

export const CHINOS: Chino[] = [
  {
    tipo: 'Zanahoria',
    ingredientes: '2 papas + 2 zanahoria',
    bolsas: 4,
    brutoKg: 10,
  },
  {
    tipo: 'Calabaza',
    ingredientes: '2 papas + 2 calabaza',
    bolsas: 4,
    brutoKg: 10,
  },
  {
    tipo: 'Calabacín',
    ingredientes: '3 papas + 2 calabacín',
    bolsas: 5,
    brutoKg: 12.5,
  },
]

export const CHINOS_BARQUETAS = 22
export const CHINOS_KG_BARQUETA = 3
export const CHINOS_TOTAL_KG = 66

// ── Molido ──

export const MOLIDO_INGREDIENTES: MolidoIngrediente[] = [
  { nombre: 'Calabacín congelado', cantidad: '2 bolsas (5 kg)' },
  { nombre: 'Zanahoria congelada', cantidad: '1 bolsa (2.5 kg)' },
  { nombre: 'Cebolla fresca', cantidad: '~1 kg' },
  { nombre: 'Pimiento fresco', cantidad: '~1 kg' },
  { nombre: 'Ajo', cantidad: '~100 g' },
  { nombre: 'Cilantro', cantidad: '~50 g' },
  { nombre: 'Fécula de maíz', cantidad: '~400 g' },
  { nombre: 'Agua/caldo', cantidad: 'hasta 60 kg' },
]

export const MOLIDO_BARQUETAS = 20
export const MOLIDO_KG_BARQUETA = 3
export const MOLIDO_TOTAL_KG = 60

export const MOLIDO_PROTEINA: MolidoProteina[] = [
  { tipo: 'Pollo', kgBruto: 8.6 },
  { tipo: 'Cerdo', kgBruto: 7.3 },
]

// ── Puré de papas ──

export const PURE: PureData = {
  bolsasPapa: 32,
  kgBruto: 80,
  mermaP: 15,
  mermaKg: 12,
  papaCocidaKg: 68,
}

export const PURE_BARQUETAS = 22
export const PURE_KG_BARQUETA = 3
export const PURE_TOTAL_KG = 66

// ── Resumen ──

export const RESUMEN_BOLSAS: ResumenBolsas = {
  papas: 39,
  zanahoria: 3,
  calabaza: 2,
  calabacin: 4,
  total: 48,
}
