import WarningMessage from '#/components/ErrorComponents/WarningMessage'

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

  if ('error' in schedules) {
    return <WarningMessage error={schedules.error} />
  }

  return (
    <>
      <div>
        <div>Schedules</div>
      </div>
    </>
  )
}
