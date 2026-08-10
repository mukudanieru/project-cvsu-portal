import { enrollments, faculty, subjectOfferings, subjects } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and } from 'drizzle-orm'
import { getSelectedPeriodQuery } from '../academic.server'
import type { SelectedPeriod } from '../academic.server'

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

export { getSelectedPeriodQuery, type SelectedPeriod }
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
