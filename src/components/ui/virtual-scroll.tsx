import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'

type VirtualScrollBarProps = {
  className?: string
  orientation?: 'vertical' | 'horizontal'
  scrollElement: HTMLDivElement | null
} & React.HTMLAttributes<HTMLDivElement>

const VirtualScrollBar: React.FC<VirtualScrollBarProps> = ({
  className,
  orientation = 'vertical',
  scrollElement,
  ...props
}) => {
  const [scrollPercentage, setScrollPercentage] = React.useState(0)
  const [scrollSize, setScrollSize] = React.useState(0)
  const [containerSize, setContainerSize] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState(0)
  const [dragStartScroll, setDragStartScroll] = React.useState(0)

  React.useEffect(() => {
    if (!scrollElement) return

    const updateScrollInfo = () => {
      const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
      } = scrollElement

      if (orientation === 'vertical') {
        const maxScroll = scrollHeight - clientHeight
        const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0
        setScrollPercentage(percentage)
        setScrollSize(clientHeight)
        setContainerSize(scrollHeight)
      } else {
        const maxScroll = scrollWidth - clientWidth
        const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0
        setScrollPercentage(percentage)
        setScrollSize(clientWidth)
        setContainerSize(scrollWidth)
      }
    }

    updateScrollInfo()
    scrollElement.addEventListener('scroll', updateScrollInfo)
    window.addEventListener('resize', updateScrollInfo)

    return () => {
      scrollElement.removeEventListener('scroll', updateScrollInfo)
      window.removeEventListener('resize', updateScrollInfo)
    }
  }, [scrollElement, orientation])

  const thumbSize =
    containerSize > 0
      ? Math.max((scrollSize / containerSize) * scrollSize, 20)
      : 20
  const thumbOffset = scrollPercentage * (scrollSize - thumbSize)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollElement) return

    e.preventDefault()
    setIsDragging(true)
    setDragStart(orientation === 'vertical' ? e.clientY : e.clientX)

    if (orientation === 'vertical') {
      setDragStartScroll(scrollElement.scrollTop)
    } else {
      setDragStartScroll(scrollElement.scrollLeft)
    }
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !scrollElement) return

      const delta =
        (orientation === 'vertical' ? e.clientY : e.clientX) - dragStart
      const maxScroll =
        orientation === 'vertical'
          ? scrollElement.scrollHeight - scrollElement.clientHeight
          : scrollElement.scrollWidth - scrollElement.clientWidth

      const scrollRatio = delta / (scrollSize - thumbSize)
      const newScroll = Math.max(
        0,
        Math.min(maxScroll, dragStartScroll + scrollRatio * maxScroll),
      )

      if (orientation === 'vertical') {
        scrollElement.scrollTop = newScroll
      } else {
        scrollElement.scrollLeft = newScroll
      }
    },
    [
      isDragging,
      scrollElement,
      dragStart,
      dragStartScroll,
      scrollSize,
      orientation,
      thumbSize,
    ],
  )

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (containerSize <= scrollSize) return null

  return (
    <div
      data-slot="virtual-scroll-scrollbar"
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <div
        data-slot="virtual-scroll-thumb"
        className="bg-border relative flex-1 rounded-full hover:bg-border/80 active:bg-border/60"
        style={{
          position: 'absolute',
          [orientation === 'vertical' ? 'top' : 'left']: `${thumbOffset}px`,
          [orientation === 'vertical' ? 'height' : 'width']: `${thumbSize}px`,
          [orientation === 'vertical' ? 'width' : 'height']: '100%',
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

type RowVirtualScrollProps<T> = {
  className?: string
  innerDivClassName?: string
  items: T[]
  renderItem: (item: T, index?: number) => React.ReactNode
  estimateSize: number
  overscan?: number
  enabled?: boolean
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
  scrollToIndex?: number
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto'
}

const RowVirtualScroll = <T,>({
  items,
  renderItem,
  estimateSize,
  overscan = 5,
  enabled = true,
  onScroll,
  scrollToIndex,
  scrollToAlignment = 'auto',
  className,
  innerDivClassName,
}: RowVirtualScrollProps<T>): React.ReactElement => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimateSize,
    overscan,
    enabled,
  })

  const virtualItems = virtualizer.getVirtualItems()

  React.useEffect(() => {
    if (scrollToIndex !== undefined) {
      virtualizer.scrollToIndex(scrollToIndex, { align: scrollToAlignment })
    }
  }, [scrollToIndex, scrollToAlignment, virtualizer])

  return (
    <div
      ref={parentRef}
      className={cn('relative overflow-hidden px-4', className)}
    >
      <div
        ref={scrollContainerRef}
        className="h-full overflow-auto no-webview-scroll-bar"
        onScroll={onScroll}
      >
        <div
          className="w-full relative"
          style={{
            height: virtualizer.getTotalSize(),
          }}
        >
          <div
            className={cn(
              'absolute top-0 left-0 w-full space-y-2',
              innerDivClassName,
            )}
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={cn('relative overflow-hidden text-base')}
              >
                {renderItem(items[virtualRow.index], virtualRow.index)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <VirtualScrollBar
        orientation="vertical"
        scrollElement={scrollContainerRef.current}
        className="absolute right-0 top-0 bottom-0"
      />
    </div>
  )
}

export { RowVirtualScroll }
export type { RowVirtualScrollProps }
