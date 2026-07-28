import type { RegFormData } from '#/lib/utils/regform'

interface FeeLine {
  label: string
  amount: number
}

const laboratoryFees: FeeLine[] = [{ label: 'CCL', amount: 400.0 }]
const otherFees: FeeLine[] = [{ label: 'Internet', amount: 185.0 }]
const assessmentFees: FeeLine[] = [
  { label: 'Tuition', amount: 2700.0 },
  { label: 'Library', amount: 650.0 },
  { label: 'Med/Dental', amount: 75.0 },
  { label: 'Publication', amount: 105.0 },
  { label: 'Registration', amount: 55.0 },
  { label: 'Guidance', amount: 25.0 },
  { label: 'SFDF', amount: 1500.0 },
  { label: 'SRF', amount: 1975.0 },
  { label: 'Athletic', amount: 100.0 },
  { label: 'SCUAA', amount: 100.0 },
]
const paymentTerms: FeeLine[] = [
  { label: 'First', amount: 3935.0 },
  { label: 'Second', amount: 1967.5 },
  { label: 'Third', amount: 1967.5 },
]

const totalLabFee = laboratoryFees.reduce((sum, f) => sum + f.amount, 0)
const totalOtherFee = otherFees.reduce((sum, f) => sum + f.amount, 0)

const RegistrationForm = ({
  studentRegistrationData,
}: {
  studentRegistrationData: RegFormData
}) => {
  const {
    studentInformation: {
      studentNumber,
      studentName,
      courseAndYear,
      address,
      section,
      semester,
      schoolYear,
    },
    subjects,
  } = studentRegistrationData

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <div>{/* BUTTON HERE */}</div>

        <div className="bg-white border border-gray-300 p-6 text-sm">
          <div className="text-center mb-4">
            <h1 className="text-lg text-primary font-semibold">
              Cavite State University
            </h1>
            <h2 className="text-base text-zinc-800 font-semibold">
              Main Campus
            </h2>
            <h3 className="text-base text-black font-semibold">
              Virtual Registration Form
            </h3>
          </div>

          <table className="w-full border border-gray-400 border-collapse mb-4">
            <tbody className="text-black">
              <tr>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Student Number
                </td>
                <td className="border border-gray-400 p-2">{studentNumber}</td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Semester
                </td>
                <td className="border border-gray-400 p-2 font-bold uppercase">
                  {semester}
                </td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  School Year
                </td>
                <td className="border border-gray-400 p-2 font-bold">
                  {schoolYear}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Student Name
                </td>
                <td className="border border-gray-400 p-2 uppercase">
                  {studentName}
                </td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Date
                </td>
                <td
                  className="border border-gray-400 p-2 uppercase"
                  colSpan={3}
                >
                  Thursday, 29 January 2026 | 7:49:56 am
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Course & Year
                </td>
                <td className="border border-gray-400 p-2 uppercase">
                  {courseAndYear}
                </td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Encoder
                </td>
                <td className="border border-gray-400 p-2">eCopy</td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Major
                </td>
                <td className="border border-gray-400 p-2" colSpan={3}>
                  N/A
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Address
                </td>
                <td
                  className="border border-gray-400 p-2 uppercase"
                  colSpan={3}
                >
                  {address}
                </td>
                <td className="border border-gray-400 p-2 font-semibold text-primary">
                  Section
                </td>
                <td className="border border-gray-400 p-2 uppercase">
                  {section}
                </td>
              </tr>
            </tbody>
          </table>

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
                <th className="border border-gray-400 p-2 text-zinc-300">
                  Units
                </th>
                <th className="border border-gray-400 p-2 text-zinc-300">
                  Time
                </th>
                <th className="border border-gray-400 p-2 text-zinc-300">
                  Day
                </th>
                <th className="border border-gray-400 p-2 text-zinc-300">
                  Room
                </th>
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
                    {/* Time */}-
                    {/* {subject.timeSlots.length
                      ? subject.timeSlots.map((time, idx) => (
                          <div key={i}>{t}</div>
                        ))
                      : '-'} */}
                  </td>
                  <td className="text-black border border-gray-400 p-2 text-center">
                    {/* Day */}-
                    {/* {subject.days.length
                      ? subject.days.map((d, i) => <div key={i}>{d}</div>)
                      : '-'} */}
                  </td>
                  <td className="text-black border border-gray-400 p-2 text-center">
                    {/* Room */}-
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[28%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
            </colgroup>

            <tbody>
              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Laboratory Fees
                </td>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Other Fees
                </td>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Assessment
                </td>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Total Units
                </td>
                <td className="p-2 border border-gray-400 text-center  text-black">
                  {/* Total Units */}
                  12
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 border border-gray-400 align-top"
                  rowSpan={10}
                >
                  <div className="flex flex-col gap-1 px-3">
                    {laboratoryFees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex justify-between font-semibold text-black"
                      >
                        <span>{fee.label}</span>
                        <span>{fee.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </td>

                <td
                  className="p-2 border border-gray-400 align-top"
                  rowSpan={10}
                >
                  <div className="flex flex-col gap-1 px-3">
                    {otherFees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex justify-between font-semibold text-black"
                      >
                        <span>{fee.label}</span>
                        <span>{fee.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </td>

                <td
                  className="p-2 border border-gray-400 align-top"
                  rowSpan={10}
                >
                  <div className="flex flex-col gap-1 px-3">
                    {assessmentFees.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex justify-between font-semibold text-black"
                      >
                        <span>{fee.label}</span>
                        <span>
                          {fee.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-black pt-1">
                      <span>Total Lab Fee</span>
                      <span>{totalLabFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-black">
                      <span>Total Other</span>
                      <span>{totalOtherFee.toFixed(2)}</span>
                    </div>
                  </div>
                </td>

                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Total Hours
                </td>
                <td className="p-2 border border-gray-400 text-center text-black">
                  14
                </td>
              </tr>

              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Total Amount
                </td>
                <td className="p-2 border border-gray-400 text-center font-bold text-black">
                  7,870.00
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Scholarship
                </td>
                <td className="p-2 border border-gray-400 text-center font-bold text-black">
                  RA 10931
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  Tuition
                </td>
                <td className="p-2 border border-gray-400 text-center italic text-black">
                  less 0%
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  SFDF
                </td>
                <td className="p-2 border border-gray-400 text-center italic text-black">
                  less 0%
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                  SRF
                </td>
                <td className="p-2 border border-gray-400 text-center italic text-black">
                  less 0%
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 border border-gray-400 text-center font-semibold text-primary"
                  colSpan={2}
                >
                  Terms of Payment
                </td>
              </tr>

              {paymentTerms.map((term) => (
                <tr key={term.label}>
                  <td className="p-2 border border-gray-400 text-center font-semibold text-primary">
                    {term.label}
                  </td>
                  <td className="p-2 border border-gray-400 text-center text-black">
                    {term.amount.toFixed(2)}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  className="p-2 border border-gray-400 text-center"
                  colSpan={3}
                >
                  <img
                    src="https://placehold.co/220x70?text=ELECTRONIC+COPY"
                    alt="Electronic copy stamp"
                    className="h-14 mx-auto"
                  />
                </td>
                <td
                  className="p-2 border border-gray-400 text-center font-semibold text-primary"
                  colSpan={2}
                >
                  Note: Unofficial Copy
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default RegistrationForm
