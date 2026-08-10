import TitleSection from '#/components/AuthedRoute/TitleSection'
import { Badge } from '#/components/ui/badge'
import type { EnrolledSubjectsSuccess } from '#/server/subject/subject.functions'

type SubjectsPageProps = {
  subjectsInfo: EnrolledSubjectsSuccess
}

const SubjectsPage = ({ subjectsInfo }: SubjectsPageProps) => {
  const { currentPeriod, studentSubjects } = subjectsInfo

  return (
    <div className="flex w-full max-w-7xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Enrolled Subjects'} />

        <div className="flex justify-between text-l font-medium">
          <div>
            School Year: {currentPeriod.startYear} - {currentPeriod.endYear}
          </div>
          <div>
            Semester: <span className="capitalize">{currentPeriod.term}</span>
          </div>
        </div>
      </div>

      <div>
        {studentSubjects.map((subject, idx) => (
          <div
            key={subject.scheduleCode}
            className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
          >
            <span className="w-5 shrink-0 text-right text-xs text-muted-foreground">
              {idx + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 justify-between">
                <p className="text-sm font-medium text-foreground">
                  {subject.subjectName}
                </p>

                {/* code visible only on mobile */}
                <Badge className="block sm:hidden mt-0.5" variant={'secondary'}>
                  <span className="shrink-0 text-xs text-foreground">
                    {subject.subjectCode}
                  </span>
                </Badge>
              </div>

              {/* code hidden on mobile */}
              <p className="hidden sm:block mt-0.5 text-xs text-foreground/85">
                {subject.facultyFirstName} {subject.facultyLastName}
              </p>
            </div>

            {/* code hidden on mobile */}
            <Badge className="hidden sm:block" variant={'secondary'}>
              <span className="shrink-0 text-xs text-foreground">
                {subject.subjectCode}
              </span>
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubjectsPage
