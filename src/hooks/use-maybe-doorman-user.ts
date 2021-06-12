import { useUserContext } from '../context'
import firebase from 'firebase/app'

const signOut = () => firebase.auth().signOut()

export function useMaybeDoormanUser(): [
  firebase.User | null,
  () => Promise<void>
] {
  const user = useUserContext()?.user ?? null
  return [user, signOut]
}
