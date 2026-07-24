import type { GroupedSchedule } from '#/lib/utils/schedules'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import ScheduleItem from './ScheduleItem'

const ScheduleMobileList = ({
  groupedScheduleData,
}: {
  groupedScheduleData: GroupedSchedule
}) => {
  if (Object.keys(groupedScheduleData).length === 0) {
    return <p>No classes scheduled.</p>
  }

  return (
    <>
      {Object.entries(groupedScheduleData).map(([day, items]) => {
        if (items.length === 0) return null

        return (
          <Card key={day} className="mb-2 p-0 gap-0">
            <CardHeader className="flex justify-between px-3.5 py-2.5">
              <CardTitle className="capitalize flex gap-4 items-center">
                <Calendar size={14} />
                {day}
              </CardTitle>

              <CardDescription className="flex gap-4 items-center text-foreground/75">
                {items.length} {items.length > 1 ? 'classes' : 'class'}
              </CardDescription>
            </CardHeader>

            <CardContent className="-mb-(--card-spacing) p-2.5 bg-accent">
              {items.map((item, idx) => (
                <ScheduleItem key={`${item.subjectCode}-${idx}`} item={item} />
              ))}
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

export default ScheduleMobileList
