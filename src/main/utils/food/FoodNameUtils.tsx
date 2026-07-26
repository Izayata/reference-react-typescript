export const FOOD_NAME_VALUE_MIN_LENGTH = 3
export const FOOD_NAME_VALUE_MAX_LENGTH = 183
export const FOOD_NAME_VALUE_ALLOWED_CHARACTERS = new RegExp('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+( [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+)*$')

export const ERR_MSG_FOOD_NAME_VALUE_REQUIRED = 'Az ételnév megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_FOOD_NAME_VALUE_LENGTH = 'A leírás legalább ' + FOOD_NAME_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + FOOD_NAME_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS = 'Az ételnév kizárólag csak betűket, számokat és szóközt tartalmazhat, de nem kezdődhet vagy végződhet szóközzel!'
