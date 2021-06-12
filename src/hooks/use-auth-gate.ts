import { useUserContext } from '../context'

export const useAuthGate = () => {
  const userContext = useUserContext()

  if (!userContext) {
    throw new Error(
      '👋Doorman useAuthGate hook error. useAuthGate was called in a component before the Doorman context was created. \n\nMake sure that your app is wrapped with DoormanProvider or withPhoneAuth.'
    )
  }

  return {
    loading: userContext.loading,
    user: userContext.user,
  }
}
