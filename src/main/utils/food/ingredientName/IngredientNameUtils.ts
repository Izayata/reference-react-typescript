export const INGREDIENT_NAME_VALUE_ALLOWED_CHARACTERS = new RegExp('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+( [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+)*$')
export const INGREDIENT_NAME_VALUE_MIN_LENGTH = 2
export const INGREDIENT_NAME_VALUE_MAX_LENGTH = 254

export const ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED = 'A hozzávalónév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH = 'A hozzávalónév legalább ' + INGREDIENT_NAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + INGREDIENT_NAME_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS = 'A hozzávalónév csak betűket és szóközt tartalmazhat, de nem kezdődhet vagy végződhet szóközzel!'
