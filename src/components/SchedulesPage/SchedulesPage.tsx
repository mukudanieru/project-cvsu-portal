import type { ScheduleItem, GroupedSchedule } from '#/lib/utils/schedules'
import { groupByDay } from '#/lib/utils/schedules'
import TitleSection from '#/components/AuthedRoute/TitleSection'
import ScheduleMobileList from './ScheduleMobileList'
import ScheduleDesktopGrid from './ScheduleDesktopGrid'

const SchedulesPage = ({ scheduleData }: { scheduleData: ScheduleItem[] }) => {
  const groupedScheduleData: GroupedSchedule = groupByDay(scheduleData)

  return (
    <div className="flex w-full max-w-7xl flex-col gap-6 px-6 py-7">
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
        <ScheduleDesktopGrid scheduleData={scheduleData} />
      </div>
    </div>
  )
}

export default SchedulesPage
