import {
  enrollments,
  subjectOfferings,
  subjects,
  academicPeriods,
  grades,
} from '#/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { db } from '#/db/drizzle'
import type { GradeValue } from '#/lib/utils/encode'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Read path: every enrollment this student has, across every term, with its
// grade if one exists yet (null otherwise). Grouping into terms happens in
// the util, not here — this stays a flat row query per convention #5.
export async function getEnrollmentsForGradingQuery(studentId: string) {
  return await db
    .select({
      enrollmentId: enrollments.id,
      periodId: subjectOfferings.periodId,
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
      subjectCode: subjects.subjectCode,
      subjectName: subjects.subjectName,
      units: subjects.units,
      finalGrade: grades.finalGrade,
    })
    .from(enrollments)
    .innerJoin(
      subjectOfferings,
      eq(enrollments.subjectOfferingId, subjectOfferings.id),
    )
    .innerJoin(subjects, eq(subjectOfferings.subjectId, subjects.id))
    .innerJoin(
      academicPeriods,
      eq(subjectOfferings.periodId, academicPeriods.id),
    )
    .leftJoin(grades, eq(grades.enrollmentId, enrollments.id))
    .where(eq(enrollments.studentId, studentId))
    .orderBy(
      asc(academicPeriods.startYear),
      asc(academicPeriods.term),
      asc(subjects.subjectCode),
    )
}

// Write-path lookup, scoped to tx: the authoritative set of enrollment ids
// (+ any existing grade) for one student + one period. This is what the
// submitted payload gets checked against for both "already submitted" and
// "is this actually complete."
async function getEnrollmentIdsForPeriodQuery(
  studentId: string,
  periodId: number,
  tx: Transaction,
) {
  return await tx
    .select({
      enrollmentId: enrollments.id,
      finalGrade: grades.finalGrade,
    })
    .from(enrollments)
    .innerJoin(
      subjectOfferings,
      eq(enrollments.subjectOfferingId, subjectOfferings.id),
    )
    .leftJoin(grades, eq(grades.enrollmentId, enrollments.id))
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(subjectOfferings.periodId, periodId),
      ),
    )
}

// Orchestration: validate the term is real, ungraded, and the submission is
// complete, then insert every grade in the term as one atomic write.
export async function insertTermGrades(
  studentId: string,
  periodId: number,
  payload: { enrollmentId: number; grade: GradeValue }[],
) {
  await db.transaction(async (tx) => {
    const expectedRows = await getEnrollmentIdsForPeriodQuery(
      studentId,
      periodId,
      tx,
    )

    if (expectedRows.length === 0) {
      throw new Error('TERM_NOT_FOUND')
    }

    if (expectedRows.some((row) => row.finalGrade !== null)) {
      throw new Error('ALREADY_SUBMITTED')
    }

    const expectedIds = new Set(expectedRows.map((row) => row.enrollmentId))
    const payloadIds = new Set(payload.map((row) => row.enrollmentId))

    const isComplete =
      expectedIds.size === payloadIds.size &&
      [...expectedIds].every((id) => payloadIds.has(id))

    if (!isComplete) {
      throw new Error('INCOMPLETE_SUBMISSION')
    }

    await tx.insert(grades).values(
      payload.map((row) => ({
        enrollmentId: row.enrollmentId,
        finalGrade: row.grade.toFixed(2),
      })),
    )
  })
}
