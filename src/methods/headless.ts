import type Firebase8 from 'firebase/app'

export let onIdTokenChangedHeadless: ReturnType<
  typeof Firebase8['auth']
>['onIdTokenChanged'] = (callback) => {
  const firebase8: typeof Firebase8 = require('firebase/app').default
  return firebase8.auth().onIdTokenChanged(callback)
}

export let signInWithCustomTokenHeadless = (
  token: Parameters<
    ReturnType<typeof Firebase8['auth']>['signInWithCustomToken']
  >[0]
) => {
  const firebase8: typeof Firebase8 = require('firebase/app').default
  return firebase8.auth().signInWithCustomToken(token)
}

export let signOutHeadless: ReturnType<
  typeof Firebase8['auth']
>['signOut'] = () => {
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
