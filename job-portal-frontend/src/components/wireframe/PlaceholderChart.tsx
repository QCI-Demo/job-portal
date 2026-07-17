type PlaceholderChartProps = {
  title: string
  variant?: 'line' | 'bar' | 'donut'
  interactionId?: string
}

const bars = [40, 65, 48, 80, 55, 72, 90]

export function PlaceholderChart({
  title,
  variant = 'bar',
  interactionId = 'chart.hover',
}: PlaceholderChartProps) {
  return (
    <section
      className="rounded-md border border-dashed border-surface-border bg-white p-4"
      data-interaction={interactionId}
      aria-label={`${title} chart placeholder`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
          {interactionId}
        </span>
      </div>

      {variant === 'donut' ? (
        <div className="flex items-center justify-center gap-6 py-6">
          <div
            className="h-28 w-28 rounded-full"
            style={{
              background:
                'conic-gradient(#1565C0 0 45%, #1E88E5 45% 70%, #90CAF9 70% 88%, #E0E0E0 88% 100%)',
            }}
            aria-hidden="true"
          />
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>Published — 45%</li>
            <li>Pending — 25%</li>
            <li>Draft — 18%</li>
            <li>Closed — 12%</li>
          </ul>
        </div>
      ) : (
        <div className="flex h-36 items-end gap-2 px-2" role="img" aria-label={`${variant} chart placeholder`}>
          {bars.map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t ${variant === 'line' ? 'bg-primary-500/80' : 'bg-primary-600'}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-ink-muted">D{index + 1}</span>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-ink-muted">Chart placeholder — swap for chart library in implementation.</p>
    </section>
  )
}
