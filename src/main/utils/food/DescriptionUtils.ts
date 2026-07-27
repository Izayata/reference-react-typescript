import i18n from '../../i18n/i18n'
export const DESCRIPTION_VALUE_MIN_LENGTH = 3
export const DESCRIPTION_VALUE_MAX_LENGTH = 1024
export const DESCRIPTION_VALUE_ALLOWED_CHARACTERS = new RegExp('^[a-zA-Z0-9#@&*()\\[\\]{}%\\-+=/.,!?;:\'"áéíóöőúüűÁÉÍÓŐÚÜŰ]+( [a-zA-Z0-9#@&*()\\[\\]{}%\\-+=/.,!?;:\'"áéíóöőúüűÁÉÍÓŐÚÜŰ]+)*$')

export const ERR_MSG_DESCRIPTION_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_DESCRIPTION_VALUE_REQUIRED')
export const ERR_MSG_DESCRIPTION_VALUE_LENGTH = i18n.t('errors.ERR_MSG_DESCRIPTION_VALUE_LENGTH', { DESCRIPTION_VALUE_MIN_LENGTH, DESCRIPTION_VALUE_MAX_LENGTH })
export const ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS = i18n.t('errors.ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS')
