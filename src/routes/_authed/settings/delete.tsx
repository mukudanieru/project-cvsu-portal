// routes/_authed/settings/delete.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authed/settings/delete')({
  component: DeleteAccountSettings,
})

function DeleteAccountSettings() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Delete confirmation flow goes here.
      </CardContent>
    </Card>
  )
}
