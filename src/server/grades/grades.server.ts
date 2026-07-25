import {
  grades,
  enrollments,
  subjectOfferings,
  subjects,
  academicPeriods,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, sql } from 'drizzle-orm'

export async function getGrades(studentID: string) {
  return await db
    .select({
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      units: subjects.units,
      finalGrade: grades.finalGrade,
    })
    .from(grades)
    .innerJoin(enrollments, eq(grades.enrollmentId, enrollments.id))
    .innerJoin(
      subjectOfferings,
      eq(enrollments.subjectOfferingId, subjectOfferings.id),
    )
    .innerJoin(subjects, eq(subjectOfferings.subjectId, subjects.id))
    .innerJoin(
      academicPeriods,
      eq(subjectOfferings.periodId, academicPeriods.id),
    )
    .where(eq(enrollments.studentId, studentID))
    .orderBy(
      academicPeriods.startYear,
      sql`CASE ${academicPeriods.term} WHEN 'first' THEN 1 WHEN 'second' THEN 2 WHEN 'summer' THEN 3 END`,
    )
}
