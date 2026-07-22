import type { GroupedSchedule } from '#/lib/utils/schedules'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'

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

              <CardDescription className="flex gap-4 items-center">
                {items.length} {items.length > 1 ? 'classes' : 'class'}
              </CardDescription>
            </CardHeader>

            <CardContent className="-mb-(--card-spacing) p-2.5 bg-accent">
              {items.map((item, idx) => {
                return (
                  <Card
                    key={`${item.subjectCode}-${idx}`}
                    className="border border-primary/25 mb-2 p-0 gap-0"
                  >
                    <CardHeader className=" bg-primary px-3.5 py-1.5">
                      <CardTitle className="capitalize text-xs font-normal">
                        {item.subjectCode} · {item.classMode}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-3.5 py-3">
                      <h1 className="uppercase text-md font-medium">
                        {item.subjectName}
                      </h1>

                      <div className="flex gap-5 items-center text-foreground/50">
                        <Clock size={14} />

                        <div>
                          {item.timeStart} - {item.timeEnd}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

export default ScheduleMobileList
