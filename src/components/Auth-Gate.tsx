import { PackageName } from '../constants'
import { useUserContext } from '../context'
import type { HeadlessFirebaseUser } from '../types/headless-types'

type Props = {
  children: (props: {
    loading: boolean
    user: HeadlessFirebaseUser | null
  }) => JSX.Element
}

export function AuthGate({ children }: Props) {
  const authGate = useUserContext()

  if (authGate) {
    return children(authGate)
  }

  console.error(`💩 ${PackageName} error:

Tried to use <AuthGate> component before initializing app with the <${PackageName}Provider /> component before it.

Make sure to put the provider at the root of your app. Or, wrap your app with withPhoneAuth.
	`)
  return null
}
