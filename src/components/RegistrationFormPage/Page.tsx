import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PAGE_PADDING_PX,
  BODY_FONT_SIZE,
  FOOTER_FONT_SIZE,
} from './layout-constants'

export interface PageProps {
  children: ReactNode
  className?: string
  pageNumber?: number
  totalPages?: number
}

// Enforces fixed A4 dimensions and the shared body font size, and
// optionally renders a "Page X of Y" footer pinned to the bottom via
// flex layout — needed since a page's content may not fill its full
// height (e.g. page 1 of a two-page split).
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, className = '', pageNumber, totalPages }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white mx-auto shadow-sm flex flex-col ${className}`}
        style={{
          width: A4_WIDTH_PX,
          minHeight: A4_HEIGHT_PX,
          padding: PAGE_PADDING_PX,
          boxSizing: 'border-box',
        }}
      >
        <div className={`flex-1 ${BODY_FONT_SIZE}`}>{children}</div>

        {pageNumber != null && totalPages != null && (
          <div
            className={`mt-auto pt-2 text-right text-gray-500 ${FOOTER_FONT_SIZE}`}
          >
            Page {pageNumber} of {totalPages}
          </div>
        )}
      </div>
    )
  },
)

Page.displayName = 'Page'

export default Page
