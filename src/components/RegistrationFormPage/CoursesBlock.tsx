import type { RegFormData } from '#/lib/utils/regform'

export interface CoursesBlockProps {
  subjects: RegFormData['subjects']
}

const CoursesBlock = ({ subjects }: CoursesBlockProps) => {
  return (
    <table className="w-full border border-gray-400 border-collapse mb-4">
      <thead>
        <tr className="bg-primary">
          <th className="border border-gray-400 p-2 text-zinc-300">
            Sched Code
          </th>
          <th className="border border-gray-400 p-2 text-zinc-300">
            Course Code
          </th>
          <th className="border border-gray-400 p-2 text-zinc-300">
            Course Description
          </th>
          <th className="border border-gray-400 p-2 text-zinc-300">Units</th>
          <th className="border border-gray-400 p-2 text-zinc-300">Time</th>
          <th className="border border-gray-400 p-2 text-zinc-300">Day</th>
          <th className="border border-gray-400 p-2 text-zinc-300">Room</th>
        </tr>
      </thead>

      <tbody>
        {subjects.map((subject) => (
          <tr key={subject.scheduleCode}>
            <td className="text-black border border-gray-400 p-2 font-bold text-center">
              {subject.scheduleCode}
            </td>
            <td className="text-black border border-gray-400 p-2 text-center">
              {subject.subjectCode}
            </td>
            <td className="text-black border border-gray-400 p-2">
              {subject.subjectName}
            </td>
            <td className="text-black border border-gray-400 p-2 text-center">
              {subject.units.toFixed(2)}
            </td>
            <td className="text-black border border-gray-400 p-2 text-center">
              {/* Time */}
              {subject.schedules.length
                ? subject.schedules.map((schedule, i) => (
                    <div key={i}>
                      {schedule.timeStart} - {schedule.timeEnd}
                    </div>
                  ))
                : '-'}
            </td>
            <td className="text-black border border-gray-400 p-2 text-center">
              {/* Day */}
              {subject.schedules.length
                ? subject.schedules.map((schedule, i) => (
                    <div className="uppercase" key={i}>
                      {schedule.day}
                    </div>
                  ))
                : '-'}
            </td>
            <td className="text-black border border-gray-400 p-2 text-center">
              {/* Room */}-
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CoursesBlock
