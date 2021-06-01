import { useDoormanContext } from '../context'
import type firebase from 'firebase/app'
import { signOutHeadless } from '../methods/headless'

export function useMaybeDoormanUser(): [
  firebase.User | null,
  () => Promise<void>
] {
  const user: firebase.User | null = useDoormanContext()?.user ?? null
  return [user, signOutHeadless]
}
