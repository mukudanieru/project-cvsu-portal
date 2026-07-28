import { useLayoutEffect, useRef, useState } from 'react'
import type { RegFormData } from '#/lib/utils/regform'
import Page from './Page'
import StudentInfoBlock from './StudentInfoBlock'
import CoursesBlock from './CoursesBlock'
import FeesBlock from './FeesBlock'
import {
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_CONTENT_WIDTH_PX,
  BODY_FONT_SIZE,
} from './layout-constants'

export interface RegistrationFormProps {
  studentRegistrationData: RegFormData
}

type PageLayout = 'measuring' | 'single-page' | 'two-page'

const RegistrationForm = ({
  studentRegistrationData,
}: RegistrationFormProps) => {
  const { studentInformation, subjects } = studentRegistrationData

  // Static for now — Total Units / Total Hours are the next todo item.
  const totalUnits = 12
  const totalHours = 14
  const enrollmentDate = 'Thursday, 29 January 2026 | 7:49:56 am'

  const [layout, setLayout] = useState<PageLayout>('measuring')

  const infoAndCoursesRef = useRef<HTMLDivElement>(null)
  const feesRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const infoAndCoursesHeight = infoAndCoursesRef.current?.offsetHeight ?? 0
    const feesHeight = feesRef.current?.offsetHeight ?? 0

    const remainingSpace = PAGE_CONTENT_HEIGHT_PX - infoAndCoursesHeight
    setLayout(remainingSpace >= feesHeight ? 'single-page' : 'two-page')
  }, [studentInformation, subjects])

  return (
    <div className="p-4">
      <div>{/* BUTTON HERE — PDF export, next todo item */}</div>

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

      {layout === 'measuring' ? null : layout === 'single-page' ? (
        <Page pageNumber={1} totalPages={1}>
          <StudentInfoBlock
            studentInformation={studentInformation}
            enrollmentDate={enrollmentDate}
          />
          <CoursesBlock subjects={subjects} />
          <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
        </Page>
      ) : (
        <div className="flex flex-col gap-4">
          <Page pageNumber={1} totalPages={2}>
            <StudentInfoBlock
              studentInformation={studentInformation}
              enrollmentDate={enrollmentDate}
            />
            <CoursesBlock subjects={subjects} />
          </Page>
          <Page pageNumber={2} totalPages={2}>
            <FeesBlock totalUnits={totalUnits} totalHours={totalHours} />
          </Page>
        </div>
      )}
    </div>
  )
}

export default RegistrationForm
