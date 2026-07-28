import type { RegFormData } from '#/lib/utils/regform'

export interface StudentInfoBlockProps {
  studentInformation: RegFormData['studentInformation']
  enrollmentDate: string
}

const StudentInfoBlock = ({
  studentInformation,
  enrollmentDate,
}: StudentInfoBlockProps) => {
  const {
    studentNumber,
    studentName,
    courseAndYear,
    address,
    section,
    semester,
    schoolYear,
  } = studentInformation

  return (
    <div className="mb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg text-primary font-bold">
          Cavite State University
        </h1>
        <h2 className="text-base text-zinc-800 font-semibold">Main Campus</h2>
        <h3 className="text-base text-black font-semibold">
          Virtual Registration Form
        </h3>
      </div>

      <table className="w-full border border-gray-400 border-collapse">
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
            <td className="border border-gray-400 p-2 uppercase" colSpan={3}>
              {enrollmentDate}
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
            <td className="border border-gray-400 p-2 uppercase" colSpan={3}>
              {address}
            </td>
            <td className="border border-gray-400 p-2 font-semibold text-primary">
              Section
            </td>
            <td className="border border-gray-400 p-2 uppercase">{section}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StudentInfoBlock
