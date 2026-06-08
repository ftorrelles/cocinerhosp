import { useEffect, useState } from 'react'
import { IconChartBar, IconList, IconAlertCircle, IconChefHat } from '@tabler/icons-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import { useAppStore } from '../store/useAppStore'
import Spinner from '../components/ui/Spinner'

const CATEGORIAS = [
  { key: '', label: 'Todas' },
  { key: 'proteina', label: 'Proteínas' },
  { key: 'guarnicion', label: 'Guarniciones' },
  { key: 'blandas', label: 'Blandas' },
  { key: 'receta', label: 'Recetas' },
] as const

interface ChefOption {
  id: string
  nombre_completo: string
  rol: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const currentUser = useAppStore((s) => s.user)
  const puedeFiltrar = currentUser?.rol === 'admin' || currentUser?.rol === 'chef_jefe'

  const [chefs, setChefs] = useState<ChefOption[]>([])
  const [selectedChefId, setSelectedChefId] = useState<string | undefined>(
    puedeFiltrar ? undefined : user?.id,
  )
  const [selectedCategoria, setSelectedCategoria] = useState('')

  const { data, loading, error } = useDashboard(
    puedeFiltrar ? selectedChefId : user?.id,
    undefined,
    selectedCategoria || undefined,
  )

  useEffect(() => {
    if (!puedeFiltrar) return

    supabase
      .rpc('listar_usuarios')
      .then(({ data: d, error: rpcError }) => {
        if (rpcError) {
          console.error('Error al listar chefs:', rpcError)
          return
        }
        setChefs((d as ChefOption[]) ?? [])
      })
  }, [puedeFiltrar])

  const renderChefFilter = () => {
    if (!puedeFiltrar) return null
    return (
      <div className="flex items-center gap-2 mb-3">
        <IconChefHat size={18} className="text-text3 shrink-0" />
        <select
          value={selectedChefId ?? ''}
          onChange={(e) => setSelectedChefId(e.target.value || undefined)}
          className="flex-1 px-3 py-[10px] text-sm border border-border rounded-sm bg-surface text-text focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Todos los chefs</option>
          {chefs.map((chef) => (
            <option key={chef.id} value={chef.id}>
              {chef.nombre_completo}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-text3 text-xs">
        <IconAlertCircle size={32} className="mb-2 opacity-50" />
        {error}
      </div>
    )
  }

  const hasData = data && data.total_elaboraciones > 0

  return (
    <>
      {renderChefFilter()}

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-[5px] mb-3">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategoria(cat.key)}
            className={`px-[10px] py-[5px] text-xs border rounded-[20px] cursor-pointer transition-all ${
              selectedCategoria === cat.key
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-text2 border-border hover:bg-accent-light'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
        {hasData && data ? (
          <>
            <MetricCard label="Raciones este mes" value={data.total_raciones} color="#1B5E3F" bg="#E8F3ED" />
            <MetricCard label="Elaboraciones" value={data.total_elaboraciones} color="#1E3A5F" bg="#EFF6FF" />
            <MetricCard label="Días con registro" value={data.dias_con_registro} color="#6B3FA0" bg="#F3EEFF" />
            <MetricCard label="Media raciones/día" value={data.media_diaria} color="#B45309" bg="#FEF3C7" />
            <MetricCard label="Hechos hoy" value={data.hechos_hoy} color="#059669" bg="#ECFDF5" />
          </>
        ) : (
          <>
            <MetricCard label="Raciones este mes" value={0} color="#1B5E3F" bg="#E8F3ED" />
            <MetricCard label="Elaboraciones" value={0} color="#1E3A5F" bg="#EFF6FF" />
            <MetricCard label="Días con registro" value={0} color="#6B3FA0" bg="#F3EEFF" />
            <MetricCard label="Media raciones/día" value={0} color="#B45309" bg="#FEF3C7" />
            <MetricCard label="Hechos hoy" value={0} color="#059669" bg="#ECFDF5" />
          </>
        )}
      </div>

      {/* Top platos */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconChartBar size={17} className="text-accent" />
          Platos más elaborados
        </div>

        {!hasData || (data && data.top_platos.length === 0) ? (
          <div className="flex flex-col items-center py-6 text-text3 text-xs">
            <IconChartBar size={24} className="mb-2 opacity-50" />
            Sin datos este mes
          </div>
        ) : (
          <div className="space-y-3">
            {data && (() => {
              const maxRaciones = data.top_platos.length > 0 ? data.top_platos[0].raciones : 1
              return data.top_platos.map((p) => {
                const pct = Math.round((p.raciones / maxRaciones) * 100)
                return (
                  <div key={p.plato}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-text font-medium">{p.plato}</span>
                      <span className="text-text2">{p.raciones} rac.</span>
                    </div>
                    <div className="h-[6px] bg-bg rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: '#1B5E3F' }} />
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        )}
      </div>

      {/* Últimos registros */}
      <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
        <div className="flex items-center gap-[7px] text-sm font-semibold text-text mb-3">
          <IconList size={17} className="text-accent" />
          Últimos registros
        </div>

        {!hasData || (data && data.ultimos_registros.length === 0) ? (
          <div className="flex flex-col items-center py-6 text-text3 text-xs">
            <IconList size={24} className="mb-2 opacity-50" />
            Sin registros aún
          </div>
        ) : (
          <div className="space-y-2">
            {data && data.ultimos_registros.map((r) => (
              <div key={r.id} className="border border-border rounded-lg px-3 py-[10px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text">{r.plato}</span>
                  <span className="text-[11px] font-mono text-text3">{r.fecha}</span>
                </div>
                <div className="text-[12px] text-text2">
                  {r.raciones} raciones · {r.servicio}
                  {r.chef ? ` · ${r.chef}` : ''}
                  {r.categoria ? ` · ${r.categoria}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

interface MetricCardProps {
  label: string
  value: number
  color: string
  bg: string
}

function MetricCard({ label, value, color, bg }: MetricCardProps) {
  return (
    <div className="rounded-xl p-[14px] shadow-sm border" style={{ background: bg, borderColor: color }}>
      <p className="text-[26px] font-bold leading-none mb-1" style={{ color }}>
        {value.toLocaleString('es-ES')}
      </p>
      <p className="text-[11px] font-medium text-text2">{label}</p>
    </div>
  )
}