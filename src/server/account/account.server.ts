import { students, accounts, courses, departments } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function getStudentInformationQuery(accountID: string) {
  const rows = await db
    .select({
      accounts: {
        universityEmail: accounts.universityEmail,
      },
      students: {
        studentNumber: students.studentNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        middleName: students.middleName,
        isEnrolled: students.isEnrolled,
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
      },
      department: {
        name: departments.name,
      },
    })
    .from(accounts)
    .innerJoin(students, eq(accounts.studentId, students.id))
    .leftJoin(courses, eq(students.courseId, courses.id))
    .leftJoin(departments, eq(courses.departmentId, departments.id))
    .where(eq(accounts.id, accountID))
    .limit(1)

  return rows[0] ?? null
}

export type StudentInformationRow = Awaited<
  ReturnType<typeof getStudentInformationQuery>
>
