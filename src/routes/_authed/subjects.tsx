import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/subjects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/subjects"!</div>
}
