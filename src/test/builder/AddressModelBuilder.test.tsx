import { AddressModelBuilder } from '../../main/builder/AddressModelBuilder'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { FloorDoorModel } from '../../main/model/customer/address/FloorDoorModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import {
  ERR_MSG_CITY_REQUIRED,
  ERR_MSG_STREET_NUMBER_REQUIRED,
  ERR_MSG_STREET_REQUIRED,
  ERR_MSG_ZIP_CODE_REQUIRED
} from '../../main/utils/customer/AddressUtils'

// Valid models for composing AddressModel
const VALID_ZIP_MODEL = new ZipCodeModel('4032')
const VALID_CITY_MODEL = new CityModel('Debrecen')
const VALID_STREET_MODEL = new StreetModel('Kossuth Lajos utca')
const VALID_STREET_NUMBER_MODEL = new StreetNumberModel('21')
const VALID_FLOOR_DOOR_MODEL = new FloorDoorModel('2/8')

// Invalid cases
const ERR_ADDRESS_MODEL_BUILDER_ZIP_UNDEFINED = () => new AddressModelBuilder()
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_ZIP_NULL = () => new AddressModelBuilder()
  .setZipCode(null as any)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_CITY_UNDEFINED = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_CITY_NULL = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(null as any)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_STREET_UNDEFINED = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_STREET_NULL = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(null as any)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_STREET_NUMBER_UNDEFINED = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const ERR_ADDRESS_MODEL_BUILDER_STREET_NUMBER_NULL = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(null as any)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

// Valid cases
const VALID_ADDRESS_MODEL_BUILDER_REQUIRED_FIELDS_ONLY = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .build()

const VALID_ADDRESS_MODEL_BUILDER_ALL_FIELDS = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(VALID_FLOOR_DOOR_MODEL)
  .build()

const VALID_ADDRESS_MODEL_BUILDER_NULL_FLOOR_DOOR = () => new AddressModelBuilder()
  .setZipCode(VALID_ZIP_MODEL)
  .setCity(VALID_CITY_MODEL)
  .setStreet(VALID_STREET_MODEL)
  .setStreetNumber(VALID_STREET_NUMBER_MODEL)
  .setFloorDoor(null)
  .build()

describe('AddressModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined zipCode', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_ZIP_UNDEFINED,
      [ERR_MSG_ZIP_CODE_REQUIRED],
      1
    )
  })

  it('should throw required error for null zipCode', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_ZIP_NULL,
      [ERR_MSG_ZIP_CODE_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined city', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_CITY_UNDEFINED,
      [ERR_MSG_CITY_REQUIRED],
      1
    )
  })

  it('should throw required error for null city', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_CITY_NULL,
      [ERR_MSG_CITY_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined street', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_STREET_UNDEFINED,
      [ERR_MSG_STREET_REQUIRED],
      1
    )
  })

  it('should throw required error for null street', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_STREET_NULL,
      [ERR_MSG_STREET_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined streetNumber', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_STREET_NUMBER_UNDEFINED,
      [ERR_MSG_STREET_NUMBER_REQUIRED],
      1
    )
  })

  it('should throw required error for null streetNumber', () => {
    expectErrorMessages(
      ERR_ADDRESS_MODEL_BUILDER_STREET_NUMBER_NULL,
      [ERR_MSG_STREET_NUMBER_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid address with required fields only', () => {
    expect(VALID_ADDRESS_MODEL_BUILDER_REQUIRED_FIELDS_ONLY).not.toThrow()
  })

  it('should accept valid address with all fields', () => {
    expect(VALID_ADDRESS_MODEL_BUILDER_ALL_FIELDS).not.toThrow()
  })

  it('should accept valid address with null floorDoor', () => {
    expect(VALID_ADDRESS_MODEL_BUILDER_NULL_FLOOR_DOOR).not.toThrow()
  })
})
