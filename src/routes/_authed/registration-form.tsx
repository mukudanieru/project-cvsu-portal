import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/registration-form')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/registration-form"!</div>
}
