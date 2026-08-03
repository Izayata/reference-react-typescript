import { useEffect, useRef } from 'react'
import { ZIP_CODE_VALUE_ALLOWED_REGEX } from '../../../../utils/customer/address/ZipCodeUtils'
import { lookupCityByZipCode, ZipCityLookupResult } from '../../../../utils/customer/address/ZipCodeCityLookupUtils'

export function useZipCityAutofill(
  zip: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  delay = 500
) {
  const lastLookedUpZip = useRef<string | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!ZIP_CODE_VALUE_ALLOWED_REGEX.test(zip)) {
      lastLookedUpZip.current = null
      return
    }
    if (zip === lastLookedUpZip.current) return

    const timeout = setTimeout(() => {
      lookupCityByZipCode(zip)
        .then((result: ZipCityLookupResult | null) => {
          lastLookedUpZip.current = zip
          if (result?.city) {
            onChangeRef.current({ target: { name: 'city', value: result.city } } as React.ChangeEvent<HTMLInputElement>)
          }
        })
        .catch(() => { /* silent: autofill is a convenience, not a hard requirement */ })
    }, delay)

    return () => clearTimeout(timeout)
  }, [zip, delay])
}
