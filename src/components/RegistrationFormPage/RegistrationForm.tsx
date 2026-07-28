import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react'
import type { RegFormData } from '#/lib/utils/regform'
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
  BODY_FONT_SIZE,
} from './layout-constants'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { getDurationInHours } from '#/lib/utils/schedules'

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

  const infoAndCoursesRef = useRef<HTMLDivElement>(null)
  const feesRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="p-4">
      {/*
        Off-screen measurement pass. Deliberately NOT wrapped in
        PageScaler — it must always measure at true A4 width,
        regardless of how small the visible page is scaled down to.
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

      {layout === 'measuring' ? (
        <PageScaler>
          <RegFormLoadingState />
        </PageScaler>
      ) : (
        <>
          <PageScaler>
            {currentPage === 1 && (
              <Page pageNumber={1} totalPages={totalPages}>
                <StudentInfoBlock
                  studentInformation={studentInformation}
                  enrollmentDate={enrollmentDate}
                />
                <CoursesBlock subjects={subjects} />
                {layout === 'single-page' && (
                  <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
                )}
              </Page>
            )}

            {currentPage === 2 && layout === 'two-page' && (
              <Page pageNumber={2} totalPages={totalPages}>
                <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
              </Page>
            )}
          </PageScaler>

          <div
            className="flex items-center justify-between mt-4 mx-auto w-full"
            style={{ maxWidth: A4_WIDTH_PX }}
          >
            <div>
              <Button variant="outline" className="gap-2">
                <FileDown className="h-4 w-4" />
                Download
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
