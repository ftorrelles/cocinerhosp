interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-9 h-9',
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} border-2 border-accent border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}
