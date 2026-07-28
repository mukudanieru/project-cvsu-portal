// A4 dimensions in px at 96 DPI (standard screen/print reference).
export const A4_WIDTH_PX = 794
export const A4_HEIGHT_PX = 1123
export const PAGE_PADDING_PX = 12

export const PAGE_CONTENT_WIDTH_PX = A4_WIDTH_PX - PAGE_PADDING_PX * 2
export const PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_PADDING_PX * 2

// Single source of truth for body copy size (table cells, labels,
// values). Applied once at the Page level and inherited down — tune
// here rather than hunting through each block. Headings in
// StudentInfoBlock keep their own explicit sizes and are unaffected.
export const BODY_FONT_SIZE = 'text-sm'

// Kept separate from BODY_FONT_SIZE so resizing body copy doesn't
// also resize the page-number footer.
export const FOOTER_FONT_SIZE = 'text-xs'
