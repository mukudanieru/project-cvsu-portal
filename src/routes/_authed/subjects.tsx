import WarningMessage from '#/components/ErrorComponents/WarningMessage'

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

  if (subjects.error) {
    return <WarningMessage error={subjects.error} />
  }

  return (
    <>
      <pre>{JSON.stringify(subjects, null, 2)}</pre>
    </>
  )
}
