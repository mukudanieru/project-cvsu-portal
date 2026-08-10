import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import SubjectsPage from '#/components/SubjectsPage/SubjectsPage'

import { getEnrolledSubjectsForCurrentUser } from '#/server/subject/subject.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/subjects')({
  loader: async () => {
    return await getEnrolledSubjectsForCurrentUser()
  },

  component: RouteComponent,
})

function RouteComponent() {
  const subjects = Route.useLoaderData()

  if ('error' in subjects) {
    return <WarningMessage error={subjects.error} />
  }

  return <SubjectsPage subjectsInfo={subjects} />
}
