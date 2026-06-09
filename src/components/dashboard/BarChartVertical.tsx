import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

interface BarChartVerticalProps {
  data: number[]
  maxValue: number
  highlightIndex: number
  labels: string[]
  subLabels?: string[]
  unit: string
  title: string
  onPrev?: () => void
  onNext?: () => void
  loading?: boolean
}

export default function BarChartVertical({
  data,
  maxValue,
  highlightIndex,
  labels,
  subLabels,
  unit,
  title,
  onPrev,
  onNext,
  loading,
}: BarChartVerticalProps) {
  const BAR_MAX_H = 120

  return (
    <div className="bg-surface border border-border rounded-xl p-[14px] mb-[10px] shadow-sm">
      {/* Header with nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrev}
          className="p-1 border border-border rounded-sm bg-surface text-text2 hover:bg-surface2 cursor-pointer shrink-0"
          aria-label="Anterior"
        >
          <IconArrowLeft size={16} />
        </button>
        <span className="flex-1 text-sm font-semibold text-text text-center px-2">
          {title}
        </span>
        <button
          onClick={onNext}
          className="p-1 border border-border rounded-sm bg-surface text-text2 hover:bg-surface2 cursor-pointer shrink-0"
          aria-label="Siguiente"
        >
          <IconArrowRight size={16} />
        </button>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-[6px] h-[130px] pt-2">
        {loading ? (
          <div className="w-full text-center text-xs text-text3 py-10">Cargando...</div>
        ) : (
          data.map((val, i) => {
            const height = maxValue > 0 ? Math.max(val > 0 ? (val / maxValue) * BAR_MAX_H : 2, 2) : 2
            const isHighlighted = i === highlightIndex

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[10px] font-medium text-text2 whitespace-nowrap">
                  {val > 0 ? `${val} ${unit}` : ''}
                </span>
                <div
                  className="w-full rounded-t-sm transition-all duration-300 min-h-[2px]"
                  style={{
                    height: `${height}px`,
                    background: isHighlighted ? '#1B5E3F' : '#A8C5B0',
                    opacity: val > 0 ? 1 : 0.4,
                  }}
                />
                <span className="text-[10px] text-text3 font-medium">{labels[i]}</span>
                {subLabels?.[i] && (
                  <span className="text-[8px] text-text3">{subLabels[i]}</span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
