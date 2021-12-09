import { useState, useEffect, useRef } from 'react'
import { empty } from '../utils/empty'
import { onIdTokenChangedHeadless } from '../methods/headless'
import { HeadlessFirebaseUser } from '../types/headless-types'

type Props = {
  onAuthStateChanged?: (user: HeadlessFirebaseUser | null) => void
}

export function useCreateFirebaseAuthListener(
  { onAuthStateChanged }: Props = empty.object
) {
  const [user, setUser] = useState<HeadlessFirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const callback = useRef(onAuthStateChanged)
  useEffect(() => {
    callback.current = onAuthStateChanged
  })

  useEffect(() => {
    const unsubscribe = onIdTokenChangedHeadless((auth) => {
      callback.current?.(auth)
      setUser(auth)
      setLoading(false)
    })
    // const unsubscribe = firebase.auth().onIdTokenChanged(auth => {
    //   callback.current?.(auth)
    //   setUser(auth)
    //   setLoading(false)
    // })
    return () => unsubscribe()
  }, [])

  return { user, loading }
}
