import { createServerFn } from '@tanstack/react-start'
import { getStudentNavInformation } from './account.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getNavInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentAccountID = await getCurrentUserFromSession()

    if (!currentAccountID) {
      throw new Error('Unauthorized')
    }

    const studentInformation = await getStudentNavInformation(currentAccountID)

    return {
      accountID: currentAccountID,
      studentNumber: studentInformation.studentNumber,
      fullName: `${studentInformation.firstName} ${studentInformation.lastName}`,
    }
  },
)
