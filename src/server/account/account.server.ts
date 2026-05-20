import { students, accounts } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function getStudentNavInformation(accountID: number) {
  // For the sidebar nav
  const result = await db
    .select({
      studentNumber: students.studentNumber,
      firstName: students.firstName,
      lastName: students.lastName,
    })
    .from(accounts)
    .innerJoin(students, eq(accounts.studentID, students.id))
    .where(eq(accounts.id, accountID))
    .limit(1)

  return result[0] ?? null
}

console.log(await getStudentNavInformation(202202887))
