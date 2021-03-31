import { useDoormanContext } from '../context'
import firebase from 'firebase/app'

const signOut = () => firebase.auth().signOut()

export function useMaybeDoormanUser(): [
  firebase.User | null,
  () => Promise<void>
] {
  const user: firebase.User | null = useDoormanContext()?.user ?? null
  return [user, signOut]
}
