export interface FeesBlockProps {
  totalUnits: number
  totalHours: number
}

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

const FeesBlock = ({ totalUnits, totalHours }: FeesBlockProps) => {
  return (
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
          <td className="p-2 border border-gray-400 text-center text-black">
            {totalUnits}
          </td>
        </tr>

        <tr>
          <td className="p-2 border border-gray-400 align-top" rowSpan={10}>
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

          <td className="p-2 border border-gray-400 align-top" rowSpan={10}>
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

          <td className="p-2 border border-gray-400 align-top" rowSpan={10}>
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
            {totalHours}
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
          <td className="p-2 border border-gray-400 text-center" colSpan={3}>
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
  )
}

export default FeesBlock
