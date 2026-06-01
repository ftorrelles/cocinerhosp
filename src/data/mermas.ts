export interface MermaEntry {
  keywords: string[]
  protMerma?: number
  guarMerma?: number
  source: string
}

export const MERMAS: MermaEntry[] = [
  // PROTEÍNAS
  { keywords: ['muslo pollo', 'muslo de pollo', 'pernil'], protMerma: 30, source: 'Muslo/pernil horno ~30% (tabla mermas hospitalaria)' },
  { keywords: ['contramuslo', 'contra muslo'], protMerma: 26, source: 'Contramuslo horno ~26% (tabla mermas aves)' },
  { keywords: ['pescado', 'merluza', 'dorada', 'lubina', 'filete pescado'], protMerma: 20, source: 'Pescado blanco horno ~20% (ChefBusiness)' },
  { keywords: ['albondiga', 'albóndiga', 'albóndigas'], protMerma: 20, source: 'Carne picada cocida ~20% (ChefBusiness)' },
  { keywords: ['hamburguesa', 'carne hamburguesa', 'carne de hamburguesa'], protMerma: 25, source: 'Carne picada plancha ~25% (Studocu)' },
  { keywords: ['quiche', 'quiché', 'huevo', 'tortilla'], protMerma: 10, source: 'Elaboración con huevo/queso ~10% (evaporación horno)' },
  { keywords: ['pechuga pollo', 'filete pollo'], protMerma: 37, source: 'Pechuga pollo cocida ~37% (Studocu)' },
  { keywords: ['cerdo', 'lomo'], protMerma: 18, source: 'Cerdo magro ~18% (Studocu)' },
  { keywords: ['ternera', 'vacuno'], protMerma: 27, source: 'Vacuno ~27% (Studocu)' },

  // GUARNICIONES
  { keywords: ['arroz'], guarMerma: -200, source: 'Arroz: absorbe agua, triplica peso (factor ×3)' },
  { keywords: ['macarron', 'macarrón', 'macarrones', 'pasta', 'espagueti', 'fideo', 'tallarín'], guarMerma: -150, source: 'Pasta seca cocida: aumenta ~2.5× el peso (absorción agua)' },
  { keywords: ['habichuela', 'habichuelas', 'judía verde', 'judias verdes', 'judías'], guarMerma: 22, source: 'Judías/habichuelas congeladas ~22% (KitchenNmbrs)' },
  { keywords: ['coliflor'], guarMerma: 25, source: 'Coliflor congelada ~20-25% (tabla mermas)' },
  { keywords: ['brocoli', 'brócoli'], guarMerma: 40, source: 'Brócoli cocido ~35-45% (KitchenNmbrs profesional)' },
  { keywords: ['menestra'], guarMerma: 22, source: 'Menestra congelada ~20-25% (tabla mermas)' },
  { keywords: ['zanahoria'], guarMerma: 20, source: 'Zanahoria cocida ~20% (tabla mermas gastronomía)' },
  { keywords: ['col bruselas', 'coles de bruselas', 'col de bruselas', 'coles brúselas'], guarMerma: 18, source: 'Col de Bruselas congelada ~15-20%' },
  { keywords: ['papa dolar', 'papas dolar', 'patatas dolar', 'papa dólar', 'papas dólar'], guarMerma: 12, source: 'Patata precocida/dólar congelada ~10-15%' },
  { keywords: ['pure', 'puré', 'pure de papa', 'puré de patata'], guarMerma: 5, source: 'Puré sobre/bolsa: merma mínima ~5%' },
  { keywords: ['patata frita', 'papa frita', 'patatas fritas', 'papas fritas'], guarMerma: 15, source: 'Patata frita congelada ~15% (KitchenNmbrs)' },
  { keywords: ['patata', 'papa'], guarMerma: 15, source: 'Patata cocida ~15% (KitchenNmbrs)' },
  { keywords: ['espinaca', 'espinacas'], guarMerma: 35, source: 'Espinacas cocidas ~35% (tabla mermas)' },
  { keywords: ['acelga'], guarMerma: 40, source: 'Acelga cocida ~40% (tabla mermas)' },
  { keywords: ['champiñon', 'seta'], guarMerma: 35, source: 'Champiñón salteado ~30-40%' },
  { keywords: ['pimiento'], guarMerma: 18, source: 'Pimiento asado ~15-20%' },
]

export function detectarMerma(
  texto: string,
  tipo: 'prot' | 'guar'
): { merma: number; source: string; found: boolean } {
  if (!texto.trim()) {
    return { merma: 0, source: '', found: false }
  }

  const t = texto.toLowerCase().trim()

  for (const entry of MERMAS) {
    for (const kw of entry.keywords) {
      if (t.includes(kw)) {
        if (tipo === 'prot' && entry.protMerma !== undefined) {
          return { merma: entry.protMerma, source: entry.source, found: true }
        }
        if (tipo === 'guar' && entry.guarMerma !== undefined) {
          return { merma: entry.guarMerma, source: entry.source, found: true }
        }
      }
    }
  }

  return { merma: 0, source: 'Sin dato automático — ajustá manualmente', found: false }
}
