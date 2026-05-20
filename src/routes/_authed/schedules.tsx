import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/schedules')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/schedules"!</div>
}
