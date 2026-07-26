import { hasLeadingOrTrailingWhitespace } from '../../CommonUtils'

export const FLOOR_DOOR_VALUE_MIN_LENGTH = 1
export const FLOOR_DOOR_VALUE_MAX_LENGTH = 10
export const FLOOR_DOOR_VALUE_ALLOWED_REGEX = new RegExp('^-?[0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(/[0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)?$')

export const ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED = 'Az emelet-/ajtószám megadása kötelező, valamint nem állhat csak szóközből!'
export const ERR_MSG_FLOOR_DOOR_VALUE_FORMAT = 'Az emelet/ajtó csak a következő formában elfogadott: "2/5", "-1/b" vagy "fsz/A"!'
export const ERR_MSG_FLOOR_DOOR_VALUE_LENGTH = 'Az emelet/ajtó legalább ' + FLOOR_DOOR_VALUE_MIN_LENGTH + ' karakter hosszú kell legyen, de nem lehet hosszabb, mint ' + FLOOR_DOOR_VALUE_MAX_LENGTH + ' karakter!'
export const ERR_MSG_FLOOR_DOOR_VALUE_LEADING_OR_TRAILING_SPACE = 'A emelet vagy ajtó nem kezdődhet vagy végződhet szóközzel, valamint nem állhat csak szóközből!'

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
