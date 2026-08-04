import i18n from '../../i18n/i18n'
export const FOOD_NAME_VALUE_MIN_LENGTH = 3
export const FOOD_NAME_VALUE_MAX_LENGTH = 183
export const FOOD_NAME_VALUE_ALLOWED_CHARACTERS = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_FOOD_NAME_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_FOOD_NAME_VALUE_REQUIRED')
export const ERR_MSG_FOOD_NAME_VALUE_LENGTH = i18n.t('errors.ERR_MSG_FOOD_NAME_VALUE_LENGTH', { FOOD_NAME_VALUE_MIN_LENGTH, FOOD_NAME_VALUE_MAX_LENGTH })
export const ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS = i18n.t('errors.ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS')
