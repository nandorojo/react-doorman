import { useCallback, useState, useEffect } from 'react'
import { doorman } from '../methods'
import { useAuthFlowState } from './use-auth-flow-state'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
interface Props {
  phoneNumber?: string
  onChangePhoneNumber?: (phoneNumber: string) => void
  /**
   * Callback function called after an SMS is successfully sent to a given number. Usually, you'll use this function to navigate to the next screen (confirming a code.)
   *
   * @param info Dictionary containing the phone number a text was sent to
   * @param info.phoneNumber The phone number a text was sent to.
   */
  onSmsSuccessfullySent(info: { phoneNumber: string }): void
  onSmsError?(e: unknown): void
}

type onChangePhoneNumber = (info: { phoneNumber: string }) => void

export function usePhoneNumber(props: Props) {
  const {
    phoneNumber,
    onChangePhoneNumber: setPhoneNumber,
    isValidPhoneNumber,
  } = useAuthFlowState()
  // const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { onSmsSuccessfullySent, onSmsError } = props

  const onChangePhoneNumber: onChangePhoneNumber = useCallback(
    ({ phoneNumber = '' }) => {
      setLoading(false)
      setError(null)
      setPhoneNumber(phoneNumber, {
        isPossiblePhoneNumber: isPossiblePhoneNumber(phoneNumber),
      })
    },
    [setPhoneNumber]
  )

  const submitPhone = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { success, error } = await doorman.signInWithPhoneNumber({
        phoneNumber,
      })
      if (!success) throw new Error(error)

      setLoading(false)
      onSmsSuccessfullySent({ phoneNumber })
    } catch (e) {
      console.error('usePhoneNumber failed', e)
      setLoading(false)
      onSmsError?.(e)
      if (typeof e === 'string') {
        setError(e)
      } else if (typeof e === 'object' && e.message) {
        setError(e.message)
      }
    }
  }, [onSmsError, onSmsSuccessfullySent, phoneNumber])

  useEffect(() => {
    setLoading(false)
  }, [phoneNumber])

  return {
    phoneNumber,
    onChangePhoneNumber,
    submitPhone,
    valid: isValidPhoneNumber,
    loading,
    error,
  }
}
