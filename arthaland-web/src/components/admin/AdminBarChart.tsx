type AdminBarChartProps = {
  title: string
  subtitle?: string
  data: { label: string; value: number }[]
  emptyMessage?: string
}

export function AdminBarChart({
  title,
  subtitle,
  data,
  emptyMessage = 'No data yet',
}: AdminBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-title-muted">{subtitle}</p>}
      {data.length === 0 || data.every((d) => d.value === 0) ? (
        <p className="mt-8 text-center text-sm text-title-muted">{emptyMessage}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {data.map((d) => (
            <li key={d.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="truncate pr-2 text-title-muted">{d.label}</span>
                <span className="tabular-nums font-medium text-ink">{d.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
                <div
                  className="h-full rounded-full bg-ink transition-all duration-500"
                  style={{ width: `${(d.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type AdminSparklineProps = {
  title: string
  subtitle?: string
  points: number[]
  labels: string[]
}

export function AdminSparkline({ title, subtitle, points, labels }: AdminSparklineProps) {
  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-title-muted">{subtitle}</p>}
        <p className="mt-8 text-center text-sm text-title-muted">No activity in this period yet</p>
      </div>
    )
  }
  const max = Math.max(1, ...points)
  const w = 320
  const h = 80
  const step = points.length > 1 ? w / (points.length - 1) : w
  const coords = points.map((v, i) => {
    const x = i * step
    const y = h - (v / max) * (h - 8) - 4
    return `${x},${y}`
  })
  const path = coords.length ? `M ${coords.join(' L ')}` : ''

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-title-muted">{subtitle}</p>}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-4 w-full max-w-md text-ink"
        aria-hidden
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((v, i) => {
          const x = i * step
          const y = h - (v / max) * (h - 8) - 4
          return <circle key={labels[i]} cx={x} cy={y} r="3" fill="currentColor" />
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-title-muted">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  )
}
