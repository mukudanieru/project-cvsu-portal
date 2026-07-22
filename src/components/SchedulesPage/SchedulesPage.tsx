import type { ScheduleItem, GroupedSchedule } from '#/lib/utils/schedules'
import { groupByDay } from '#/lib/utils/schedules'
import TitleSection from '#/components/AuthedRoute/TitleSection'
import ScheduleMobileList from './ScheduleMobileList'

const SchedulesPage = ({ scheduleData }: { scheduleData: ScheduleItem[] }) => {
  const groupedScheduleData: GroupedSchedule = groupByDay(scheduleData)

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 px-8 py-10">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Schedule'} />
      </div>

      {/* Schedule Items List */}
      <div className="block lg:hidden">
        {/* Mobile/Tablet */}
        <ScheduleMobileList groupedScheduleData={groupedScheduleData} />
      </div>

      <div className="hidden lg:block">
        {/* Desktop */}
        <h1>Desktop</h1>
      </div>
    </div>
  )
}

export default SchedulesPage
