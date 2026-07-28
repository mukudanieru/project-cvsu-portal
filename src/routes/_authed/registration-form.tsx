import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import RegistrationFormPage from '#/components/RegistrationFormPage/RegistrationFormPage'

import { getRegFormInformationForCurrentUser } from '#/server/regform/regform.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/registration-form')({
  loader: async () => {
    return getRegFormInformationForCurrentUser()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const studentRegistrationData = Route.useLoaderData()

  if ('error' in studentRegistrationData) {
    return <WarningMessage error={studentRegistrationData.error} />
  }

  return (
    <>
      <RegistrationFormPage studentRegistrationData={studentRegistrationData} />
    </>
  )
}
