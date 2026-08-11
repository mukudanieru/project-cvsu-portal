import { selectedPeriods, academicPeriods, students } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export async function getSelectedPeriodQuery(studentId: string) {
  return await db
    .select({
      id: academicPeriods.id,
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
    })
    .from(selectedPeriods)
    .innerJoin(
      academicPeriods,
      eq(academicPeriods.id, selectedPeriods.periodId),
    )
    .where(eq(selectedPeriods.studentId, studentId))
}

export type SelectedPeriod = Awaited<
  ReturnType<typeof getSelectedPeriodQuery>
>[number]

export async function getStudentEnrollmentInfoQuery(studentId: string) {
  const [student] = await db
    .select({
      sectionId: students.sectionId,
      isEnrolled: students.isEnrolled,
    })
    .from(students)
    .where(eq(students.id, studentId))

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return student ?? null
}
