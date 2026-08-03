import i18n from '../../../i18n/i18n'

export const ERR_MSG_CITY_LOOKUP_FAILED = i18n.t('errors.ERR_MSG_CITY_LOOKUP_FAILED')

export interface ZipCityLookupResult {
  zipCode: string
  city: string
}

export async function lookupCityByZipCode(zipCode: string): Promise<ZipCityLookupResult | null> {
  const res = await fetch(`/v1/zip-codes/${encodeURIComponent(zipCode)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(ERR_MSG_CITY_LOOKUP_FAILED)
  return res.json()
}
