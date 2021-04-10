import React, {
  useContext,
  useEffect,
  useReducer,
  useCallback,
  createContext,
  ReactNode,
  useMemo,
} from 'react'
import { useCreateFirebaseAuthListener } from '../hooks/use-create-firebase-auth-listener'
import { doorman, InitializationProps } from '../methods'
import { theme as themeCreator } from '../style/theme'

import { isTestPhoneNumber } from '../utils/is-test-phone-number'
import type firebase from 'firebase/app'
// import { isPossiblePhoneNumber } from 'react-phone-number-input'

type AuthFlowContext = AuthFlowState & {
  authenticateApp: () => void
  onChangePhoneNumber: (
    phoneNumber: string,
    { isPossiblePhoneNumber }: { isPossiblePhoneNumber: boolean }
  ) => void
  setCodeScreenReady: (ready: boolean) => void
}

type Context =
  | null
  | ({
      user: null | firebase.User
      loading: boolean
      theme?: ReturnType<typeof themeCreator>
      // authFlowState: AuthFlowState & {
      //   authenticateApp: () => void
      //   onChangePhoneNumber: (phoneNumber: string, { isPossiblePhoneNumber }: { isPossiblePhoneNumber: boolean }) => void
      //   setCodeScreenReady: (ready: boolean) => void
      // }
    } & AuthFlowContext)

export type ProviderProps = {
  theme?: ReturnType<typeof themeCreator>
  children: ReactNode
  onAuthStateChanged?: (user: firebase.User | null) => void
  /**
   * (Optional) The initial state of the phone number field.
   * If you aren't based in the US, you may want to set this to the prefix of your country.
   *
   * Default: `+1`
   */
  initialPhoneNumber?: string
}

const DoormanContext = createContext<Context>(null)

type AuthFlowState = {
  phoneNumber: string
  /**
   * If true, the <AuthFlow /> component shows the Verify Code Screen.
   */
  ready: boolean
  isValidPhoneNumber: boolean
}

type AuthFlowStateAction =
  | {
      type: 'UPDATE_PHONE_NUMBER'
      phoneNumber: string
      isPossiblePhoneNumber: boolean
    }
  | { type: 'SET_READY'; ready: boolean }

const authFlowStateReducer = (
  state: AuthFlowState,
  action: AuthFlowStateAction
): AuthFlowState => {
  switch (action.type) {
    case 'SET_READY':
      return {
        ...state,
        ready: action.ready,
      }
    case 'UPDATE_PHONE_NUMBER':
      return {
        ...state,
        phoneNumber: action.phoneNumber,
        isValidPhoneNumber:
          action.isPossiblePhoneNumber || isTestPhoneNumber(action.phoneNumber),
        // isPossiblePhoneNumber(action.phoneNumber) ||
      }
    default:
      throw new Error(
        '🚨🥶 Doorman AuthFlowState reducer error. Called an inexistent action.'
      )
  }
}

/**
 * The auth flow state is handled at the root of the app.
 *
 * The `phoneNumber` prop is used always, whether someone is building a custom auth flow or not.
 *
 * The `ready` prop is only used when Doorman is handling the entire flow, via either `withPhoneAuth` or `AuthFlow`.
 *
 * This means that the phone number the user is typing, as well as the `ready` state of the flow, is available to all screens.
 *
 * The `<AuthFlow.PhoneScreen />` component will access the `phoneNumber` and `onChangePhoneNumber`. It will call `setCodeScreenReady(true)` to advance.
 */
const useCreateAuthFlowState = (props?: {
  initialPhoneNumber?: string
}): AuthFlowContext => {
  const [authState, dispatch] = useReducer(authFlowStateReducer, {
    phoneNumber: props?.initialPhoneNumber ?? '+1',
    ready: false,
    isValidPhoneNumber: false,
  })

  const authenticateApp = useCallback(() => {
    dispatch({ type: 'SET_READY', ready: false })
  }, [])
  const onChangePhoneNumber = useCallback(
    (
      phoneNumber: string,
      { isPossiblePhoneNumber }: { isPossiblePhoneNumber: boolean }
    ) => {
      dispatch({
        type: 'UPDATE_PHONE_NUMBER',
        phoneNumber,
        isPossiblePhoneNumber,
      })
    },
    []
  )
  const setCodeScreenReady = useCallback(
    (ready: boolean) => dispatch({ type: 'SET_READY', ready }),
    []
  )

  return {
    ...authState,
    authenticateApp,
    onChangePhoneNumber,
    setCodeScreenReady,
  }
}

export function DoormanProvider({
  children,
  publicProjectId,
  onAuthStateChanged: onAuthStateChangedProp,
  theme = themeCreator(),
  initialPhoneNumber,
}: ProviderProps & InitializationProps) {
  const {
    phoneNumber,
    ready,
    isValidPhoneNumber,
    authenticateApp,
    onChangePhoneNumber,
    setCodeScreenReady,
  } = useCreateAuthFlowState({ initialPhoneNumber })
  const { user, loading } = useCreateFirebaseAuthListener({
    onAuthStateChanged: (user) => {
      onAuthStateChangedProp?.(user)
      setCodeScreenReady(false)
    },
  })

  useEffect(() => {
    doorman.initialize({ publicProjectId })
  }, [publicProjectId])

  const value = useMemo(
    () => ({
      user,
      loading,
      theme,
      phoneNumber,
      ready,
      isValidPhoneNumber,
      authenticateApp,
      onChangePhoneNumber,
      setCodeScreenReady,
    }),
    [
      user,
      loading,
      theme,
      phoneNumber,
      ready,
      isValidPhoneNumber,
      authenticateApp,
      onChangePhoneNumber,
      setCodeScreenReady,
    ]
  )

  return (
    <DoormanContext.Provider value={value}>{children}</DoormanContext.Provider>
  )
}

export function Doorman({
  children,
}: {
  children: (context: Context) => ReactNode
}) {
  return <DoormanContext.Consumer>{children}</DoormanContext.Consumer>
}

export function useDoormanContext() {
  return useContext(DoormanContext)
}
