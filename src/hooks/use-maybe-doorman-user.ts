import { useUserContext } from '../context'
import { signOutHeadless } from '../methods/headless'
import { HeadlessFirebaseUser } from '../types/headless-types'

export function useMaybeDoormanUser(): [
  HeadlessFirebaseUser | null,
  () => Promise<void>
] {
  const user = useUserContext()?.user ?? null
  return [user, signOutHeadless]
}
