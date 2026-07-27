export const ALLERGEN_NAME_VALUE_ALLOWED_CHARACTERS = new RegExp('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+( [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+)*$')
export const ALLERGEN_NAME_VALUE_MIN_LENGTH = 2
export const ALLERGEN_NAME_VALUE_MAX_LENGTH = 254

export const ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED = 'Az allergénnév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH = 'Az allergénnév legalább ' + ALLERGEN_NAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + ALLERGEN_NAME_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS = 'Az allergénnév csak betűket és szóközt tartalmazhat, de nem kezdődhet vagy végződhet szóközzel!'
