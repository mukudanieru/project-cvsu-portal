import { enrollments, faculty, subjectOfferings, subjects } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

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
    .where(eq(enrollments.studentId, studentID))
    .innerJoin(
      subjectOfferings,
      eq(subjectOfferings.id, enrollments.subjectOfferingId),
    )
    .innerJoin(subjects, eq(subjects.id, subjectOfferings.subjectId))
    .innerJoin(faculty, eq(faculty.id, subjectOfferings.facultyId))
}
