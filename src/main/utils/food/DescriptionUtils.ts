export const DESCRIPTION_VALUE_MIN_LENGTH = 3
export const DESCRIPTION_VALUE_MAX_LENGTH = 1024
export const DESCRIPTION_VALUE_ALLOWED_CHARACTERS = new RegExp('^[a-zA-Z0-9#@&*()\\[\\]{}%\\-+=/.,!?;:\'"áéíóöőúüűÁÉÍÓŐÚÜŰ]+( [a-zA-Z0-9#@&*()\\[\\]{}%\\-+=/.,!?;:\'"áéíóöőúüűÁÉÍÓŐÚÜŰ]+)*$')

export const ERR_MSG_DESCRIPTION_VALUE_REQUIRED = 'A leírás megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_DESCRIPTION_VALUE_LENGTH = 'A leírás legalább ' + DESCRIPTION_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + DESCRIPTION_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS = 'A leírás kizárólag csak betűket, számokat , szóközöket és gyakori speciális jeleket tartalmazhat, valamint nem kezdődhet vagy végződhet szóközzel!'
