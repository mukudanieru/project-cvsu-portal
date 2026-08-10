import TitleSection from '../AuthedRoute/TitleSection'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SettingsPage = () => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Account Settings'} />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="delete">Delete</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  View your key metrics and recent project activity. Track
                  progress across all your active projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You have 12 active projects and 3 pending tasks.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track performance and user engagement metrics. Monitor trends
                  and identify growth opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Page views are up 25% compared to last month.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="delete">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and download your detailed reports. Export data in
                  multiple formats for analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You have 5 reports ready and available to export.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingsPage
