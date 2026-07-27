import { AllergenModel } from '../../model/food/AllergenModel'

export const ERR_MSG_ALLERGEN_ID_REQUIRED = 'Az allergén-azonosító megadása kötelező!'
export const ERR_MSG_ALLERGEN_NAME_REQUIRED = 'Az allergénnév megadása kötelező!'

export async function fetchAllergens(): Promise<AllergenModel[]> {
  const res = await fetch(
    '/v1/allergens',
    { 
      credentials: 'include' 
    }
  ) 

  if (!res.ok) throw new Error('Hiba történt az allergének lekérésekor.')

  const data = await res.json()
  
  return data as AllergenModel[]
}
