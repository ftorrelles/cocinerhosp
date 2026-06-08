import { type Centro } from '../data/centros'

// ── Result Types ──

export interface ProteinaResult {
  unidadesNecesarias: number
  cajasAbrir: number
  unidadesDisponibles: number
  sobrante: number
  sobranteRaciones: number
  mermaP: number
}

export interface GuarnicionResult {
  netoNecesario: number
  brutoNecesario: number
  netoReal: number
  bolsas: number
  sobrante: number
  mermaP: number
}

export interface DesgloseCentro {
  nombre: string
  color: string
  pax: number
  unidades: number
}

// ── PROTEÍNA ──

export function calcularProteina(params: {
  totalPacientes: number
  unidadesPorCaja: number
  unidadesPorRacion: number
  mermaP: number
}): ProteinaResult {
  const { totalPacientes, unidadesPorCaja, unidadesPorRacion, mermaP } = params

  const unidadesNecesarias = unidadesPorRacion * totalPacientes
  const cajasAbrir = unidadesPorCaja > 0
    ? Math.ceil(unidadesNecesarias / unidadesPorCaja)
    : 0
  const unidadesDisponibles = cajasAbrir * unidadesPorCaja
  const sobrante = unidadesDisponibles - unidadesNecesarias
  const sobranteRaciones = unidadesPorRacion > 0
    ? Math.floor(sobrante / unidadesPorRacion)
    : 0

  return { unidadesNecesarias, cajasAbrir, unidadesDisponibles, sobrante, sobranteRaciones, mermaP }
}

// ── BANDEJAS DE HORNO ──

export function calcularBandejasHorno(params: {
  unidadesNecesarias: number
  capacidadBandeja?: number
}): number {
  const capacidad = params.capacidadBandeja ?? 25
  return Math.ceil(params.unidadesNecesarias / capacidad)
}

// ── GUARNICIÓN ──

export function calcularGuarnicion(params: {
  totalPacientes: number
  bolsaKg: number
  mermaP: number
  racionG: number
}): GuarnicionResult {
  const { totalPacientes, bolsaKg, mermaP, racionG } = params
  const bolsaG = bolsaKg * 1000
  const merma = mermaP / 100
  const netoNecesario = racionG * totalPacientes

  let brutoNecesario: number
  let netoReal: number
  let bolsas: number

  if (merma < 0) {
    // Absorción (arroz, pasta) — merma negativa = aumenta peso
    const factor = 1 + Math.abs(merma)
    brutoNecesario = netoNecesario / factor
    bolsas = Math.ceil(brutoNecesario / bolsaG)
    const brutoReal = bolsas * bolsaG
    netoReal = brutoReal * factor
    brutoNecesario = brutoReal
  } else {
    // Merma normal — pierde peso al cocer
    brutoNecesario = netoNecesario / (1 - merma)
    bolsas = Math.ceil(brutoNecesario / bolsaG)
    const brutoReal = bolsas * bolsaG
    netoReal = brutoReal * (1 - merma)
    brutoNecesario = brutoReal
  }

  const sobrante = Math.round(netoReal - netoNecesario)

  return { netoNecesario, brutoNecesario, netoReal, bolsas, sobrante, mermaP }
}

// ── DESGLOSE POR CENTRO ──

export function calcularDesgloseCentros(params: {
  centros: Centro[]
  servicio: 'almuerzo' | 'cena'
  unidadesPorRacion: number
}): DesgloseCentro[] {
  return params.centros
    .filter((c) => {
      const pax = params.servicio === 'almuerzo' ? c.paxAlmuerzo : c.paxCena
      return pax > 0
    })
    .map((c) => ({
      nombre: c.nombre,
      color: c.color,
      pax: params.servicio === 'almuerzo' ? c.paxAlmuerzo : c.paxCena,
      unidades: params.unidadesPorRacion * (params.servicio === 'almuerzo' ? c.paxAlmuerzo : c.paxCena),
    }))
}

// ── ESCALADO DE RECETAS ──

export interface IngredienteEscalable {
  nombre: string
  cantidad: number
  unidad: string
}

export function escalarIngredientes(
  ingredientes: IngredienteEscalable[],
  totalPacientes: number,
  racionesBase: number,
): IngredienteEscalable[] {
  if (racionesBase <= 0 || totalPacientes <= 0) return ingredientes
  const factor = totalPacientes / racionesBase
  return ingredientes.map((ing) => ({
    ...ing,
    cantidad: Math.round(ing.cantidad * factor * 100) / 100,
  }))
}
