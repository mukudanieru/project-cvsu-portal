import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import GradesPage from '#/components/GradesPage/GradesPage'

import { getGradesForCurrentUser } from '#/server/grades/grades.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/grades')({
  loader: async () => {
    return getGradesForCurrentUser()
  },

  component: RouteComponent,
})

function RouteComponent() {
  const grades = Route.useLoaderData()

  if ('error' in grades) {
    return <WarningMessage error={grades.error} />
  }

  return (
    <>
      <GradesPage academicYearGrades={grades} />
    </>
  )
}
