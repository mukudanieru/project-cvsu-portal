import type { RegFormData } from '#/lib/utils/regform'
import TitleSection from '../AuthedRoute/TitleSection'
import RegistrationForm from './RegistrationForm'

const RegistrationFormPage = ({
  studentRegistrationData,
}: {
  studentRegistrationData: RegFormData
}) => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <div className="flex flex-col gap-5">
        <TitleSection title={'Virtual Registration Form'} />
      </div>

      <RegistrationForm studentRegistrationData={studentRegistrationData} />
    </div>
  )
}

export default RegistrationFormPage
