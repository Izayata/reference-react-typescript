import { AllergenModel } from '../../model/food/AllergenModel'
import i18n from '../../i18n/i18n'

export const ERR_MSG_ALLERGEN_ID_REQUIRED = i18n.t('errors.ERR_MSG_ALLERGEN_ID_REQUIRED')
export const ERR_MSG_ALLERGEN_NAME_REQUIRED = i18n.t('errors.ERR_MSG_ALLERGEN_NAME_REQUIRED')

export async function fetchAllergens(): Promise<AllergenModel[]> {
  const res = await fetch(
    '/v1/allergens',
    { 
      credentials: 'include' 
    }
  ) 

  if (!res.ok) throw new Error(i18n.t('allergen.fetchError'))

  const data = await res.json()
  
  return data as AllergenModel[]
}
