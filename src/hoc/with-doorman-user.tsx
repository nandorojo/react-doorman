import * as React from 'react'
import { useDoormanUser } from '../hooks/use-doorman-user'
import { ComponentType } from 'react'
import type { HeadlessFirebaseUser } from '../types/headless-types'

export function withDoormanUser<P>(
  Component: ComponentType<P & { user: HeadlessFirebaseUser }>
) {
  const WithUser = (props: P) => {
    const user = useDoormanUser()
    return <Component {...props} user={user} />
  }
  return WithUser
}
