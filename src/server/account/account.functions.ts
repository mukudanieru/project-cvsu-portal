import { createServerFn } from '@tanstack/react-start'
import { getStudentInformation } from './account.server'
import { getCurrentUserFromSession } from '../auth/auth.server'

export const getNavInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentAccountID = await getCurrentUserFromSession()

    if (!currentAccountID) {
      return {
        error: {
          title: 'Unauthorized',
          description: 'You must be logged in to access this resource.',
        },
      }
    }

    const studentInformation = await getStudentInformation(currentAccountID)

    if (!studentInformation) {
      return {
        error: {
          title: 'Student Not Found',
          description: 'No student record is associated with this account.',
        },
      }
    }

    return {
      accountID: currentAccountID,
      studentNumber: studentInformation.students.studentNumber,
      fullName: `${studentInformation.students.firstName} ${studentInformation.students.lastName}`,
    }
  },
)

export const getAccountInformation = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentAccountID = await getCurrentUserFromSession()

    if (!currentAccountID) {
      return {
        error: {
          title: 'Unauthorized',
          description: 'You must be logged in to access this resource.',
        },
      }
    }

    const studentInformation = await getStudentInformation(currentAccountID)

    if (!studentInformation) {
      return {
        error: {
          title: 'Student Not Found',
          description: 'No student record is associated with this account.',
        },
      }
    }

    const middleInitial = studentInformation.students.middleName?.[0]
      ? `${studentInformation.students.middleName[0]}.`
      : undefined

    const fullName = [
      studentInformation.students.firstName,
      middleInitial,
      studentInformation.students.lastName,
    ]
      .filter(Boolean)
      .join(' ')

    return {
      universityEmail: studentInformation.accounts.universityEmail,
      studentNumber: studentInformation.students.studentNumber,
      fullName: fullName,
      studentStatus: studentInformation.students.studentStatus,
      sex: studentInformation.students.sex,
      address: studentInformation.students.address,
      relationshipStatus: studentInformation.students.relationshipStatus,
      birthday: studentInformation.students.birthday,
      citizenship: studentInformation.students.citizenship,
      guardian: studentInformation.students.guardian,
      courseCode: studentInformation.course?.courseCode,
      courseName: studentInformation.course?.courseName,
      department: studentInformation.course?.department,
    }
  },
)
