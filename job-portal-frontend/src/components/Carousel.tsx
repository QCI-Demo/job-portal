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
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
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
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div
          id={regionId}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${activeIndex + 1} of ${itemCount}`}
          className="p-4 sm:p-6"
        >
          {items[activeIndex]}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            aria-controls={regionId}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                className={`h-2.5 w-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  index === activeIndex ? 'bg-primary-600' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-controls={regionId}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
