import { useUserContext } from '../context'
import type firebase from 'firebase/app'
import { signOutHeadless } from '../methods/headless'

export function useMaybeDoormanUser(): [
  firebase.User | null,
  () => Promise<void>
] {
  const user = useUserContext()?.user ?? null
  return [user, signOutHeadless]
}
