/* eslint-disable flowtype/no-types-missing-file-annotation */
import { useUserContext } from '../context'
import { signOutHeadless } from '../methods/headless'

import type { HeadlessFirebaseUser } from '../types/headless-types'

export function useDoormanUser(): HeadlessFirebaseUser & {
  signOut: () => Promise<void>
} {
  const user = useUserContext()?.user
  if (!user)
    throw new Error(
      'Doorman error: called the useDoormanUser hook in a component when the user was not authenticated. This hook can only be called once the user has authenticated.\n\n If you want to use this hook on a screen that does not always have a user, try the useMaybeDoormanUser() hook, or useAuthGate().'
    )

  return {
    ...user,
    signOut: signOutHeadless,
  }
}
