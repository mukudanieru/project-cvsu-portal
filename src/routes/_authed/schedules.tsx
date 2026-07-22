import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import SchedulesPage from '#/components/SchedulesPage/SchedulesPage'

import { getSubjectOfferingSchedulesForCurrentUser } from '#/server/schedule/schedule.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/schedules')({
  loader: async () => {
    return await getSubjectOfferingSchedulesForCurrentUser()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const schedules = Route.useLoaderData()

  console.log(schedules)

  if ('error' in schedules) {
    return <WarningMessage error={schedules.error} />
  }

  return (
    <>
      <SchedulesPage scheduleData={schedules} />
    </>
  )
}
