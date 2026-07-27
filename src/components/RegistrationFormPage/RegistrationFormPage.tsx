import type { RegFormData } from '#/lib/utils/regform'
import TitleSection from '../AuthedRoute/TitleSection'

const RegistrationFormPage = ({
  studentRegistrationInformation,
}: {
  studentRegistrationInformation: RegFormData
}) => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Virtual Registration Form'} />
      </div>

      <pre>{JSON.stringify(studentRegistrationInformation, null, 2)}</pre>
    </div>
  )
}

export default RegistrationFormPage
