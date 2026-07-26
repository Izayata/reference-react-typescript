import { AddressModel } from '../../../main/model/customer/AddressModel'
import { ZipCodeModel } from '../../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../../main/model/customer/address/CityModel'
import { StreetModel } from '../../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../main/model/customer/address/StreetNumberModel'
import { FloorDoorModel } from '../../../main/model/customer/address/FloorDoorModel'
import { expectErrorMessages } from '../../../main/utils/test/ExpectErrorMessages'
import {
  ERR_MSG_CITY_REQUIRED,
  ERR_MSG_STREET_NUMBER_REQUIRED,
  ERR_MSG_STREET_REQUIRED,
  ERR_MSG_ZIP_CODE_REQUIRED
} from '../../../main/utils/customer/AddressUtils'

// Valid models for composing AddressModel
const VALID_ZIP_MODEL = new ZipCodeModel('4032')
const VALID_CITY_MODEL = new CityModel('Debrecen')
const VALID_STREET_MODEL = new StreetModel('Kossuth Lajos utca')
const VALID_STREET_NUMBER_MODEL = new StreetNumberModel('21')
const VALID_FLOOR_DOOR_MODEL = new FloorDoorModel('2/8')

// Invalid cases
const ERR_ADDRESS_MODEL_ZIP_UNDEFINED = () => new AddressModel(
  undefined as any,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_ZIP_NULL = () => new AddressModel(
  null as any,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_CITY_UNDEFINED = () => new AddressModel(
  VALID_ZIP_MODEL,
  undefined as any,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_CITY_NULL = () => new AddressModel(
  VALID_ZIP_MODEL,
  null as any,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_STREET_UNDEFINED = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  undefined as any,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_STREET_NULL = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  null as any,
  VALID_STREET_NUMBER_MODEL
)
const ERR_ADDRESS_MODEL_STREET_NUMBER_UNDEFINED = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  undefined as any
)
const ERR_ADDRESS_MODEL_STREET_NUMBER_NULL = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  null as any
)

// Valid cases
const VALID_ADDRESS_MODEL_REQUIRED_FIELDS_ONLY = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL
)
const VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_VALID = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL,
  VALID_FLOOR_DOOR_MODEL
)
const VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_NULL = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL,
  null as any
)
const VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_UNDEFINED = () => new AddressModel(
  VALID_ZIP_MODEL,
  VALID_CITY_MODEL,
  VALID_STREET_MODEL,
  VALID_STREET_NUMBER_MODEL,
  undefined as any
)

describe('AddressModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined zipCode', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_ZIP_UNDEFINED,
      [ERR_MSG_ZIP_CODE_REQUIRED],
      1
    )
  })

  it('should throw required error for null zipCode', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_ZIP_NULL,
      [ERR_MSG_ZIP_CODE_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined city', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_CITY_UNDEFINED,
      [ERR_MSG_CITY_REQUIRED],    
      1
    )
  })
  it('should throw required error for null city', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_CITY_NULL,
      [ERR_MSG_CITY_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined street', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_STREET_UNDEFINED,
      [ERR_MSG_STREET_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null street', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_STREET_NULL,
      [ERR_MSG_STREET_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined streetNumber', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_STREET_NUMBER_UNDEFINED,
      [ERR_MSG_STREET_NUMBER_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null streetNumber', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_STREET_NUMBER_NULL,
      [ERR_MSG_STREET_NUMBER_REQUIRED],
      1
    )
  })

  it('should return false if other is null', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(undefined as any)).toBe(false)
  })

  it('should return false for addresses with different zipCode', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    const b = new AddressModel(
      new ZipCodeModel('4026'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(b)).toBe(false)
  })

  it('should return false for addresses with different city', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Budapest'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(b)).toBe(false)
  })

  it('should return false for addresses with different street', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Petőfi Sándor utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(b)).toBe(false)
  })

  it('should return false for addresses with different streetNumber', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('22')
    )
    expect(a.equals(b)).toBe(false)
  })

  it('should return false for addresses with different floorDoor', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      new FloorDoorModel('2/8')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      new FloorDoorModel('3/9')
    )
    expect(a.equals(b)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid address with required fields only', () => {
    expect(VALID_ADDRESS_MODEL_REQUIRED_FIELDS_ONLY).not.toThrow()
  })

  it('should accept valid address with all fields', () => {
    expect(VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_NULL).not.toThrow()
  })

  it('should accept valid address with all fields', () => {
    expect(VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_UNDEFINED).not.toThrow()
  })

  it('should accept valid address with all fields', () => {
    expect(VALID_ADDRESS_MODEL_ALL_FIELDS_FLOOR_DOOR_VALID).not.toThrow()
  })

  it('should return true for identical addresses with all fields', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      new FloorDoorModel('2/8')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      new FloorDoorModel('2/8')
    )
    expect(a.equals(b)).toBe(true)
  })

  it('should return true for identical addresses with no floorDoor', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21')
    )
    expect(a.equals(b)).toBe(true)
  })

  it('should return true if both floorDoor are null or undefined', () => {
    const a = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      null
    )
    const b = new AddressModel(
      new ZipCodeModel('4032'),
      new CityModel('Debrecen'),
      new StreetModel('Kossuth Lajos utca'),
      new StreetNumberModel('21'),
      undefined
    )
    expect(a.equals(b)).toBe(true)
  })
})
