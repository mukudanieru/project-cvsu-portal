import { getSubjectOfferingSchedulesForCurrentUser } from '#/server/schedule/schedule.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/schedules')({
  loader: async () => {
    const enrolledSubjects = await getSubjectOfferingSchedulesForCurrentUser()

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
  const schedules = Route.useLoaderData()

  return (
    <>
      <div>
        {schedules.map((schedule) => (
          <div key={schedule.subjectCode}>
            <h3>{schedule.subjectCode}</h3>
            <p>{schedule.subjectName}</p>
            <p>Day: {schedule.day}</p>
            <p>
              Time: {schedule.timeStart} - {schedule.timeEnd}
            </p>
            <p>Mode: {schedule.classMode}</p>
          </div>
        ))}
      </div>
    </>
  )
}
