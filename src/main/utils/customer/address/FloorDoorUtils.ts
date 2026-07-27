import { hasLeadingOrTrailingWhitespace } from '../../CommonUtils'
import i18n from '../../../i18n/i18n'

export const FLOOR_DOOR_VALUE_MIN_LENGTH = 1
export const FLOOR_DOOR_VALUE_MAX_LENGTH = 10
export const FLOOR_DOOR_VALUE_ALLOWED_REGEX = new RegExp('^-?[0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(/[0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)?$')

export const ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED = i18n.t('errors.ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED')
export const ERR_MSG_FLOOR_DOOR_VALUE_FORMAT = i18n.t('errors.ERR_MSG_FLOOR_DOOR_VALUE_FORMAT')
export const ERR_MSG_FLOOR_DOOR_VALUE_LENGTH = i18n.t('errors.ERR_MSG_FLOOR_DOOR_VALUE_LENGTH', { FLOOR_DOOR_VALUE_MIN_LENGTH, FLOOR_DOOR_VALUE_MAX_LENGTH })
export const ERR_MSG_FLOOR_DOOR_VALUE_LEADING_OR_TRAILING_SPACE = i18n.t('errors.ERR_MSG_FLOOR_DOOR_VALUE_LEADING_OR_TRAILING_SPACE')

export function validateFloorDoor(floorDoor: string) {
  if (hasLeadingOrTrailingWhitespace(floorDoor)) {
    throw new Error(ERR_MSG_FLOOR_DOOR_VALUE_LEADING_OR_TRAILING_SPACE)
  }
  if (!FLOOR_DOOR_VALUE_ALLOWED_REGEX.test(floorDoor)) {
    throw new Error(ERR_MSG_FLOOR_DOOR_VALUE_FORMAT)
  }
  if (floorDoor.length < FLOOR_DOOR_VALUE_MIN_LENGTH || floorDoor.length > FLOOR_DOOR_VALUE_MAX_LENGTH) {
    throw new Error(ERR_MSG_FLOOR_DOOR_VALUE_LENGTH)
  }
}
