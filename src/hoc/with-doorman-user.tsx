import * as React from 'react'
import { useDoormanUser } from '../hooks/use-doorman-user'
import { ComponentType } from 'react'
import type firebase from 'firebase/app'

export function withDoormanUser<P>(
	Component: ComponentType<P & { user: firebase.User }>
) {
	const WithUser = (props: P) => {
		const user = useDoormanUser()
		return <Component {...props} user={user} />
	}
	return WithUser
}
