import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

interface CarouselProps {
  items: ReactNode[]
  label: string
  className?: string
}

export function Carousel({ items, label, className = '' }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const regionId = useId()
  const liveRef = useRef<HTMLDivElement>(null)

  const itemCount = items.length
  const hasItems = itemCount > 0

  const goTo = useCallback(
    (index: number) => {
      if (!hasItems) return
      const next = ((index % itemCount) + itemCount) % itemCount
      setActiveIndex(next)
    },
    [hasItems, itemCount],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (liveRef.current && hasItems) {
      liveRef.current.textContent = `Showing slide ${activeIndex + 1} of ${itemCount}`
    }
  }, [activeIndex, hasItems, itemCount])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasItems) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(itemCount - 1)
    }
  }

  if (!hasItems) {
    return (
      <p className="rounded-lg border border-dashed border-surface-border bg-surface p-8 text-center text-ink-muted">
        No featured jobs available right now.
      </p>
    )
  }

  return (
    <section
      className={className}
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <div className="relative overflow-hidden rounded-xl border border-surface-border bg-white shadow-card">
        <div
          id={regionId}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${activeIndex + 1} of ${itemCount}`}
          className="p-4 sm:p-6"
        >
          {items[activeIndex]}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-surface-border px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            aria-controls={regionId}
            aria-label="Previous featured job"
            className="btn-secondary !min-h-[44px] !px-3 !py-2 !text-sm"
          >
            Previous
          </button>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Carousel slides"
          >
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-3 w-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
                  index === activeIndex ? 'bg-primary-600' : 'bg-surface-border hover:bg-ink-muted'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-controls={regionId}
            aria-label="Next featured job"
            className="btn-secondary !min-h-[44px] !px-3 !py-2 !text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
