import { useEffect, useState } from 'react'
import { getErrorMessages } from '../../utils/ErrorUtils'

export function useDebouncedModelValidation(
  value: string,
  ModelClass: new (value: string) => unknown,
  delay = 500
): string[] | string {
  const [error, setError] = useState<string[] | string>('')

  useEffect(() => {
    if (!value) {
      setError('')
      return
    }

    const validationTimeout = setTimeout(() => {
      try {
        new ModelClass(value)
        setError('')
      } catch (e) {
        setError(getErrorMessages(e))
      }
    }, delay)

    return () => clearTimeout(validationTimeout)
  }, [value, ModelClass, delay])

  return error
}
