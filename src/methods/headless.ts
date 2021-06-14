import type Firebase8 from 'firebase/app'
import { HeadlessFirebaseUser } from '../types/headless-types'

type OnIdTokenChangedHeadless = (
  callback: (user: HeadlessFirebaseUser | null) => void
) => () => void

type OnIdTokenChanged = ReturnType<typeof Firebase8['auth']>['onIdTokenChanged']

export let onIdTokenChangedHeadless: OnIdTokenChangedHeadless = (callback) => {
  const firebase8: typeof Firebase8 = require('firebase/app').default
  return firebase8
    .auth()
    .onIdTokenChanged(callback as Parameters<OnIdTokenChanged>[0])
}

type SignInWithCustomToken = Parameters<
  ReturnType<typeof Firebase8['auth']>['signInWithCustomToken']
>[0]

type SignInWithCustomTokenHeadless = (
  token: string
) => Promise<{ user: HeadlessFirebaseUser | null }>

export let signInWithCustomTokenHeadless: SignInWithCustomTokenHeadless = (
  token
) => {
  const firebase8: typeof Firebase8 = require('firebase/app').default
  return firebase8.auth().signInWithCustomToken(token)
}

type SignOut = ReturnType<typeof Firebase8['auth']>['signOut']

export let signOutHeadless: SignOut = () => {
  const firebase8: typeof Firebase8 = require('firebase/app').default
  return firebase8.auth().signOut()
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
