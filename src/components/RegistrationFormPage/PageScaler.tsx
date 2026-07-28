import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { A4_WIDTH_PX, A4_HEIGHT_PX } from './layout-constants'

export interface PageScalerProps {
  children: ReactNode
}

// Shrinks the A4 page to fit whatever width is actually available
// (collapsed/expanded sidebar, mobile viewport, etc.) via a pure CSS
// transform. The page still renders internally at full A4_WIDTH_PX,
// so text wrapping and the pagination/measurement logic in
// RegistrationForm are completely unaffected — only the final
// on-screen pixels shrink. Never scales up past 1 on wide screens.
const PageScaler = ({ children }: PageScalerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateScale = () => {
      const availableWidth = container.offsetWidth
      setScale(Math.min(1, availableWidth / A4_WIDTH_PX))
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      {/* Reserves the scaled-down footprint so nothing below collapses
          into the space the transform visually vacates. */}
      <div
        style={{
          width: A4_WIDTH_PX * scale,
          height: A4_HEIGHT_PX * scale,
        }}
      >
        <div
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageScaler
