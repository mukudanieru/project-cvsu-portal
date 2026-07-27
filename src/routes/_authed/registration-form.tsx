import WarningMessage from '#/components/ErrorComponents/WarningMessage'
import RegistrationFormPage from '#/components/RegistrationFormPage/RegistrationFormPage'

import { getRegFormInformationForCurrentUser } from '#/server/regform/reform.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/registration-form')({
  loader: async () => {
    return getRegFormInformationForCurrentUser()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const studentRegistrationInformation = Route.useLoaderData()

  if ('error' in studentRegistrationInformation) {
    return <WarningMessage error={studentRegistrationInformation.error} />
  }

  return (
    <>
      <RegistrationFormPage
        studentRegistrationInformation={studentRegistrationInformation}
      />
    </>
  )
}
