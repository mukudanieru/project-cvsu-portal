import {
  enrollments,
  faculty,
  subjectOfferings,
  subjects,
  academicPeriods,
} from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq, and } from 'drizzle-orm'

export async function getEnrolledSubjects(studentID: string) {
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
    .innerJoin(
      academicPeriods,
      eq(academicPeriods.id, subjectOfferings.periodId),
    )
    .innerJoin(subjects, eq(subjects.id, subjectOfferings.subjectId))
    .innerJoin(faculty, eq(faculty.id, subjectOfferings.facultyId))
    .where(
      and(
        eq(enrollments.studentId, studentID),
        eq(academicPeriods.isCurrent, true),
      ),
    )
}

export async function getCurrentPeriod() {
  return await db
    .select({
      startYear: academicPeriods.startYear,
      endYear: academicPeriods.endYear,
      term: academicPeriods.term,
    })
    .from(academicPeriods)
    .where(eq(academicPeriods.isCurrent, true))
}
