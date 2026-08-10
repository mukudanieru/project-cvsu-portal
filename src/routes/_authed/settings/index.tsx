// routes/_authed/settings/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authed/settings/')({
  component: ProfileSettings,
})

function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your address, sex, birthday, citizenship, relationship status,
          and guardian.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Edit form goes here.
      </CardContent>
    </Card>
  )
}
