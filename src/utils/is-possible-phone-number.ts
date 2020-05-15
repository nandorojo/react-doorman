import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function isPossiblePhoneNumber(value: string): boolean {
  if (!value) {
    return false
  }
  const phoneNumber = parsePhoneNumberFromString(value)
  if (!phoneNumber) {
    return false
  }
  return phoneNumber.isPossible()
}
