import {
  enrollments,
  faculty,
  subjectOfferings,
  subjects,
  academicPeriods,
  selectedPeriods,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and } from 'drizzle-orm'

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

export async function getEnrolledSubjectsQuery(
  studentId: string,
  periodId: number,
) {
  return await db
    .select({
      subjectName: subjects.subjectName,
      subjectCode: subjects.subjectCode,
      scheduleCode: subjectOfferings.scheduleCode,
      facultyFirstName: faculty.firstName,
      facultyLastName: faculty.lastName,
    })
    .from(enrollments)
    .innerJoin(
      subjectOfferings,
      eq(subjectOfferings.id, enrollments.subjectOfferingId),
    )
    .innerJoin(subjects, eq(subjects.id, subjectOfferings.subjectId))
    .innerJoin(faculty, eq(faculty.id, subjectOfferings.facultyId))
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(subjectOfferings.periodId, periodId),
      ),
    )
}

export type SelectedPeriod = Awaited<
  ReturnType<typeof getSelectedPeriodQuery>
>[number]
export type EnrolledSubject = Awaited<
  ReturnType<typeof getEnrolledSubjectsQuery>
>[number]

// Orchestration: student's selected period drives everything now —
// no institutional "current period" fallback.
export async function getEnrolledSubjectsForStudent(studentId: string) {
  const period = await getSelectedPeriodQuery(studentId)

  if (period.length === 0) {
    return { period: null, studentSubjects: [] as Array<EnrolledSubject> }
  }

  const studentSubjects = await getEnrolledSubjectsQuery(
    studentId,
    period[0].id,
  )

  return { period: period[0], studentSubjects }
}
