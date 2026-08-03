import i18n from '../../../i18n/i18n'

export const DOOR_VALUE_MIN_LENGTH = 1
export const DOOR_VALUE_MAX_LENGTH = 4
export const DOOR_VALUE_ALLOWED_REGEX = new RegExp('^[0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$')

export const ERR_MSG_DOOR_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_DOOR_VALUE_REQUIRED')
export const ERR_MSG_DOOR_VALUE_FORMAT = i18n.t('errors.ERR_MSG_DOOR_VALUE_FORMAT')
export const ERR_MSG_DOOR_VALUE_LENGTH = i18n.t('errors.ERR_MSG_DOOR_VALUE_LENGTH', { DOOR_VALUE_MIN_LENGTH, DOOR_VALUE_MAX_LENGTH })
