import { getEnrolledSubjectsForCurrentUser } from '#/server/subject/subject.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/subjects')({
  loader: async () => {
    const enrolledSubjects = await getEnrolledSubjectsForCurrentUser()

    if ('error' in enrolledSubjects) {
      throw redirect({
        to: '/',
      })
    }

    return enrolledSubjects
  },

  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <>
      {/* <div>Hello "/_authed/subjects"!</div> */}
      <div>
        {data.map((item) => (
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
