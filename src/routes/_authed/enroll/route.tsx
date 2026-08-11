import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import TitleSection from '@/components/AuthedRoute/TitleSection'

export const Route = createFileRoute('/_authed/enroll')({
  component: EnrollLayout,
})

const tabs = [
  { label: 'Subjects', to: '/enroll' },
  { label: 'Encode', to: '/enroll/encode' },
] as const

function EnrollLayout() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title="Enrollment" />

        <div className="inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-0.75 text-muted-foreground">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === '/enroll' }}
              className="relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              activeProps={{
                className:
                  'bg-background shadow-sm border-border dark:bg-input/60 dark:border-input',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  )
}
