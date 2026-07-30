interface GeneratePdfOptions {
  pageNodes: HTMLElement[]
  pageWidth: number
  pageHeight: number
  filename: string
}

// Captures each provided DOM node as an image (via html2canvas-pro) and
// assembles them into a single downloadable PDF (via jsPDF), one node
// per page, in order. Both libraries are dynamically imported so this
// only ever runs client-side — safe to call from a click handler in an
// SSR app, since click handlers never execute during server render.
export async function generatePdfFromPages({
  pageNodes,
  pageWidth,
  pageHeight,
  filename,
}: GeneratePdfOptions): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ])

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [pageWidth, pageHeight],
  })

  for (let i = 0; i < pageNodes.length; i++) {
    const canvas = await html2canvas(pageNodes[i], {
      scale: 2, // sharper output than a 1:1 pixel capture
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imageData = canvas.toDataURL('image/png')

    if (i > 0) {
      pdf.addPage([pageWidth, pageHeight])
    }
    pdf.addImage(imageData, 'PNG', 0, 0, pageWidth, pageHeight)
  }

  pdf.save(filename)
}
