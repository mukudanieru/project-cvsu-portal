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

  if ('error' in subjects) {
    return <WarningMessage error={subjects.error} />
  }

  return (
    <>
      <div>
        {subjects.map((item) => (
          <div key={item.scheduleCode}>
            <h3>{item.subjectName}</h3>
            <p>Code: {item.subjectCode}</p>
            <p>Schedule: {item.scheduleCode}</p>
            <p>
              Faculty: {item.facultyFirstName} {item.facultyLastName}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
