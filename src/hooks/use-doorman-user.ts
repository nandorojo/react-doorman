import firebase from 'firebase/app'

import { useUserContext } from '../context'

const signOut = () => firebase.auth().signOut()

export function useDoormanUser(): firebase.User & {
  signOut: () => Promise<void>
} {
  const user = useUserContext()?.user as firebase.User
  if (!user)
    throw new Error(
      'Doorman error: called the useDoormanUser hook in a component when the user was not authenticated. This hook can only be called once the user has authenticated.\n\n If you want to use this hook on a screen that does not always have a user, try the useMaybeDoormanUser() hook, or useAuthGate().'
    )
  return {
    ...user,
    signOut,
  }
}
