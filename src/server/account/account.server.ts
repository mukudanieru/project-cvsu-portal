import { students, accounts } from '@/db/schema'
import { db } from '@/db/drizzle'
import { eq } from 'drizzle-orm'

export async function getStudentInformation(
  accountID: number,
): Promise<(typeof student)[0] | null> {
  const student = await db
    .select()
    .from(accounts)
    .innerJoin(students, eq(accounts.studentID, students.id))
    .where(eq(accounts.id, accountID))
    .limit(1)

  return student[0] ?? null
}
