import i18n from '../../../i18n/i18n'

export const STREET_NAME_VALUE_MIN_LENGTH = 2
export const STREET_NAME_VALUE_MAX_LENGTH = 40
export const STREET_NAME_VALUE_ALLOWED_REGEX = new RegExp('^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9\\-\'\\.]+)*$')

export const ERR_MSG_STREET_NAME_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_STREET_NAME_VALUE_REQUIRED')
export const ERR_MSG_STREET_NAME_VALUE_FORMAT = i18n.t('errors.ERR_MSG_STREET_NAME_VALUE_FORMAT')
export const ERR_MSG_STREET_NAME_VALUE_LENGTH = i18n.t('errors.ERR_MSG_STREET_NAME_VALUE_LENGTH', { STREET_NAME_VALUE_MIN_LENGTH, STREET_NAME_VALUE_MAX_LENGTH })
