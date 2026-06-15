import { students, accounts, courses } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function getStudentInformation(
  accountID: number,
): Promise<(typeof student)[0] | null> {
  const student = await db
    .select({
      accounts: {
        universityEmail: accounts.universityEmail,
      },
      students: {
        studentNumber: students.studentNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        middleName: students.middleName,
        studentStatus: students.studentStatus,
        sex: students.sex,
        address: students.address,
        relationshipStatus: students.relationshipStatus,
        birthday: students.birthday,
        citizenship: students.citizenship,
        guardian: students.guardian,
      },
      course: {
        courseCode: courses.courseCode,
        courseName: courses.courseName,
        department: courses.department,
      },
    })
    .from(accounts)
    .innerJoin(students, eq(accounts.studentID, students.id))
    .leftJoin(courses, eq(students.courseId, courses.id))
    .where(eq(accounts.id, accountID))
    .limit(1)

  return student[0] ?? null
}
