import type firebase8 from 'firebase/app'
import type * as Native from '@react-native-firebase/auth'

export type HeadlessFirebaseUser =
  | firebase8.User
  | Native.FirebaseAuthTypes.User
