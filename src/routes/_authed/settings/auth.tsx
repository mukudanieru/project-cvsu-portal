// routes/_authed/settings/auth.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authed/settings/auth')({
  component: SecuritySettings,
})

function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Change your account password.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Password change form goes here.
      </CardContent>
    </Card>
  )
}
