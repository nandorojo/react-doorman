import { HeadlessFirebaseUser } from '../types/headless-types'

type OnIdTokenChangedHeadless = (
  callback: (user: HeadlessFirebaseUser | null) => void
) => () => void

export let onIdTokenChangedHeadless: OnIdTokenChangedHeadless = (callback) => {
  const firebase = require('firebase/auth') as typeof import('firebase/auth')
  return firebase.getAuth().onIdTokenChanged(callback)
}

type SignInWithCustomTokenHeadless = (
  token: string
) => Promise<{ user: HeadlessFirebaseUser | null }>

export let signInWithCustomTokenHeadless: SignInWithCustomTokenHeadless = (
  token
) => {
  const firebase = require('firebase/auth') as typeof import('firebase/auth')
  const auth = firebase.getAuth()
  return firebase.signInWithCustomToken(auth, token)
}

export let signOutHeadless = () => {
  const auth = (require('firebase/auth') as typeof import('firebase/auth')).getAuth()
  return auth.signOut()
}

export function makeHeadless({
  signInWithCustomToken,
  idTokenListener,
  signOut,
}: {
  signInWithCustomToken: typeof signInWithCustomTokenHeadless
  idTokenListener: typeof onIdTokenChangedHeadless
  signOut: typeof signOutHeadless
}) {
  onIdTokenChangedHeadless = idTokenListener
  signInWithCustomTokenHeadless = signInWithCustomToken
  signOutHeadless = signOut
}
