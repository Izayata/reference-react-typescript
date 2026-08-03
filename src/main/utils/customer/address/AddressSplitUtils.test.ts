import {
  combineStreetNameAndType,
  splitStreetIntoNameAndType,
  combineFloorAndDoor,
  splitFloorDoorIntoFloorAndDoor
} from './AddressSplitUtils'

describe('AddressSplitUtils', () => {
  describe('combineStreetNameAndType', () => {
    it('joins name and type with a single space', () => {
      expect(combineStreetNameAndType('Kossuth Lajos', 'utca')).toBe('Kossuth Lajos utca')
    })

    it('returns the name alone when type is empty', () => {
      expect(combineStreetNameAndType('Kossuth Lajos', '')).toBe('Kossuth Lajos')
    })

    it('returns an empty string when name is empty, regardless of type', () => {
      expect(combineStreetNameAndType('', 'utca')).toBe('')
      expect(combineStreetNameAndType('', '')).toBe('')
    })
  })

  describe('splitStreetIntoNameAndType', () => {
    it('splits a combined street into name and a recognized type', () => {
      expect(splitStreetIntoNameAndType('Kossuth Lajos utca')).toEqual({ streetName: 'Kossuth Lajos', streetType: 'utca' })
    })

    it('matches the type case-insensitively', () => {
      expect(splitStreetIntoNameAndType('Kossuth Lajos UTCA')).toEqual({ streetName: 'Kossuth Lajos', streetType: 'utca' })
    })

    it('puts the whole value in streetName when no known type suffix matches', () => {
      expect(splitStreetIntoNameAndType('Egyetem sgt')).toEqual({ streetName: 'Egyetem sgt', streetType: '' })
    })

    it('returns empty parts for an empty string', () => {
      expect(splitStreetIntoNameAndType('')).toEqual({ streetName: '', streetType: '' })
    })

    it('round-trips through combine', () => {
      const combined = combineStreetNameAndType('Petőfi Sándor', 'tér')
      expect(splitStreetIntoNameAndType(combined)).toEqual({ streetName: 'Petőfi Sándor', streetType: 'tér' })
    })
  })

  describe('combineFloorAndDoor', () => {
    it('joins floor and door with a slash', () => {
      expect(combineFloorAndDoor('3', 'A')).toBe('3/A')
    })

    it('returns the floor alone when door is empty', () => {
      expect(combineFloorAndDoor('11', '')).toBe('11')
    })

    it('returns an empty string when floor is empty, regardless of door', () => {
      expect(combineFloorAndDoor('', 'A')).toBe('')
      expect(combineFloorAndDoor('', '')).toBe('')
    })
  })

  describe('splitFloorDoorIntoFloorAndDoor', () => {
    it('splits a combined floor/door value on the slash', () => {
      expect(splitFloorDoorIntoFloorAndDoor('fsz/1')).toEqual({ floor: 'fsz', door: '1' })
    })

    it('treats a value with no slash as floor-only', () => {
      expect(splitFloorDoorIntoFloorAndDoor('11')).toEqual({ floor: '11', door: '' })
    })

    it('returns empty parts for an empty string', () => {
      expect(splitFloorDoorIntoFloorAndDoor('')).toEqual({ floor: '', door: '' })
    })

    it('round-trips through combine', () => {
      const combined = combineFloorAndDoor('3', 'A')
      expect(splitFloorDoorIntoFloorAndDoor(combined)).toEqual({ floor: '3', door: 'A' })
    })
  })
})
