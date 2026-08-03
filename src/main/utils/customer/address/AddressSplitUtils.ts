import { STREET_TYPES } from './StreetTypeUtils'

export function combineStreetNameAndType(name: string, type: string): string {
  if (!name) return ''
  return type ? `${name} ${type}` : name
}

export function splitStreetIntoNameAndType(street: string): { streetName: string, streetType: string } {
  if (!street) return { streetName: '', streetType: '' }
  const lower = street.toLocaleLowerCase('hu')
  const matchedType = STREET_TYPES.find(type => lower.endsWith(` ${type}`))
  if (!matchedType) return { streetName: street, streetType: '' }
  return {
    streetName: street.slice(0, street.length - matchedType.length).trim(),
    streetType: matchedType
  }
}

export function combineFloorAndDoor(floor: string, door: string): string {
  if (!floor) return ''
  return door ? `${floor}/${door}` : floor
}

export function splitFloorDoorIntoFloorAndDoor(floorDoor: string): { floor: string, door: string } {
  if (!floorDoor) return { floor: '', door: '' }
  const [floor, door = ''] = floorDoor.split('/')
  return { floor, door }
}
