import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react'
import type { RegFormData } from '#/lib/utils/regform'
import { getDurationInHours } from '#/lib/utils/schedules'
import { generatePdfFromPages } from '#/lib/utils/pdf-export'
import Page from './Page'
import PageScaler from './PageScaler'
import StudentInfoBlock from './StudentInfoBlock'
import CoursesBlock from './CoursesBlock'
import FeesBlock from './FeesBlock'
import RegFormLoadingState from './RegFormLoadingState'
import {
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_CONTENT_WIDTH_PX,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  BODY_FONT_SIZE,
} from './layout-constants'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { toast } from 'sonner'

export interface RegistrationFormProps {
  studentRegistrationData: RegFormData
}

type PageLayout = 'measuring' | 'single-page' | 'two-page'

const RegistrationForm = ({
  studentRegistrationData,
}: RegistrationFormProps) => {
  const { studentInformation, subjects } = studentRegistrationData

  const totalUnits = useMemo(
    () => subjects.reduce((sum, subject) => sum + subject.units, 0),
    [subjects],
  )

  const totalHours = useMemo(
    () =>
      subjects.reduce((sum, subject) => {
        const subjectHours = subject.schedules.reduce(
          (scheduleSum, schedule) =>
            scheduleSum +
            getDurationInHours(schedule.timeStart, schedule.timeEnd),
          0,
        )
        return sum + subjectHours
      }, 0),
    [subjects],
  )

  // Static for now
  const enrollmentDate = 'Thursday, 29 January 2026 | 7:49:56 am'

  const [layout, setLayout] = useState<PageLayout>('measuring')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDownloading, setIsDownloading] = useState(false)

  const infoAndCoursesRef = useRef<HTMLDivElement>(null)
  const feesRef = useRef<HTMLDivElement>(null)

  // Export-only refs — always hold the FULL, unscaled page content,
  // independent of currentPage/PageScaler, so both pages are ready to
  // capture the instant Download is clicked.
  const exportPage1Ref = useRef<HTMLDivElement>(null)
  const exportPage2Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const infoAndCoursesHeight = infoAndCoursesRef.current?.offsetHeight ?? 0
    const feesHeight = feesRef.current?.offsetHeight ?? 0

    const remainingSpace = PAGE_CONTENT_HEIGHT_PX - infoAndCoursesHeight
    setLayout(remainingSpace >= feesHeight ? 'single-page' : 'two-page')
    setCurrentPage(1) // reset to page 1 whenever the underlying data changes
  }, [studentInformation, subjects])

  const totalPages = layout === 'two-page' ? 2 : 1

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  // Shared page content — used by both the visible (currentPage-gated,
  // PageScaler-wrapped) render and the export-only hidden render below,
  // so the two never drift out of sync with each other.
  const renderPage1Content = () => (
    <>
      <StudentInfoBlock
        studentInformation={studentInformation}
        enrollmentDate={enrollmentDate}
      />
      <CoursesBlock subjects={subjects} />
      {layout === 'single-page' && (
        <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
      )}
    </>
  )

  const renderPage2Content = () => (
    <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
  )

  const handleDownload = async () => {
    const pageNodes = [exportPage1Ref.current, exportPage2Ref.current].filter(
      (node): node is HTMLDivElement => node !== null,
    )

    if (pageNodes.length === 0) return

    const filename = `REGFORM_${studentInformation.studentNumber}_${studentInformation.schoolYear}.pdf`

    setIsDownloading(true)
    try {
      await generatePdfFromPages({
        pageNodes,
        pageWidth: A4_WIDTH_PX,
        pageHeight: A4_HEIGHT_PX,
        filename,
      })
      toast.success('Registration form downloaded', {
        description: filename,
      })
    } catch (error) {
      console.error('Failed to generate registration form PDF', error)
      toast.error("Couldn't download registration form", {
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="p-4">
      {/*
        Off-screen measurement pass. Uses the same BODY_FONT_SIZE as
        the real Page render — if these ever drift apart, measured
        heights won't match final layout and the page-fit decision
        below will be wrong.
      */}
      <div
        aria-hidden
        className={BODY_FONT_SIZE}
        style={{
          position: 'absolute',
          top: 0,
          left: -9999,
          visibility: 'hidden',
          width: PAGE_CONTENT_WIDTH_PX,
        }}
      >
        <div ref={infoAndCoursesRef}>
          <StudentInfoBlock
            studentInformation={studentInformation}
            enrollmentDate={enrollmentDate}
          />
          <CoursesBlock subjects={subjects} />
        </div>
        <div ref={feesRef}>
          <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
        </div>
      </div>

      {/*
        Export-only hidden render. Deliberately NOT visibility:hidden —
        positioned off-screen instead, since html2canvas has a history
        of producing blank captures for visibility:hidden content.
        Always renders every page regardless of currentPage, so
        Download works no matter which page the user is looking at.
      */}
      {layout !== 'measuring' && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: -9999,
            pointerEvents: 'none',
          }}
        >
          <div ref={exportPage1Ref}>
            <Page pageNumber={1} totalPages={totalPages}>
              {renderPage1Content()}
            </Page>
          </div>

          {layout === 'two-page' && (
            <div ref={exportPage2Ref}>
              <Page pageNumber={2} totalPages={totalPages}>
                {renderPage2Content()}
              </Page>
            </div>
          )}
        </div>
      )}

      {layout === 'measuring' ? (
        <PageScaler>
          <RegFormLoadingState />
        </PageScaler>
      ) : (
        <>
          <PageScaler>
            {currentPage === 1 && (
              <Page pageNumber={1} totalPages={totalPages}>
                {renderPage1Content()}
              </Page>
            )}

            {currentPage === 2 && layout === 'two-page' && (
              <Page pageNumber={2} totalPages={totalPages}>
                {renderPage2Content()}
              </Page>
            )}
          </PageScaler>

          <div
            className="flex items-center justify-between mt-4 mx-auto w-full"
            style={{ maxWidth: A4_WIDTH_PX }}
          >
            <div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/65 max-[321px]:hidden">
                Page {currentPage} of {totalPages}
              </span>

              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage <= 1}
                      onClick={goToPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage >= totalPages}
                      onClick={goToNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RegistrationForm
