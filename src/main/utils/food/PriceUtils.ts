export const PRICE_AMOUNT_ALLOWED_REGEX = new RegExp('^[\\d]+(\\.[\\d]+)?$')
export const PRICE_CURRENCY_ALLOWED_REGEX = new RegExp('^[a-zA-ZéáűőúöüóíÉÁŰÖÜÓŐÚÍ]+$')

export const ERR_MSG_PRICE_AMOUNT_REQUIRED = 'Az ár összegét kötelező megadni, valamint nem állhat csak szóközből!'
export const ERR_MSG_PRICE_CURRENCY_REQUIRED = 'Az ár pénznemét kötelező megadni, valamint nem állhat csak szóközből!'
export const ERR_MSG_PRICE_AMOUNT_INVALID_CHARACTER = 'Az ár összege csak számokat és egy darab pontot tartalmazhat!'
export const ERR_MSG_PRICE_CURRENCY_INVALID_CHARACTER = 'Az ár pénzneme csak betűket tartalmazhat!'
