import { validateSync } from 'class-validator'
import { NotUndefined } from '../../myDecorators/NotUndefined'
import { CityModel } from './address/CityModel'
import { FloorDoorModel } from './address/FloorDoorModel'
import { StreetModel } from './address/StreetModel'
import { StreetNumberModel } from './address/StreetNumberModel'
import { ZipCodeModel } from './address/ZipCodeModel'
import { NotNull } from '../../myDecorators/NotNull'
import { ERR_MSG_CITY_REQUIRED, ERR_MSG_STREET_NUMBER_REQUIRED, ERR_MSG_STREET_REQUIRED, ERR_MSG_ZIP_CODE_REQUIRED } from '../../utils/customer/AddressUtils'

export class AddressModel {
  @NotNull({ message: ERR_MSG_ZIP_CODE_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ZIP_CODE_REQUIRED })
    zipCode: ZipCodeModel

  @NotNull({ message: ERR_MSG_CITY_REQUIRED })
  @NotUndefined({ message: ERR_MSG_CITY_REQUIRED })
    city: CityModel

  @NotNull({ message: ERR_MSG_STREET_REQUIRED })
  @NotUndefined({ message: ERR_MSG_STREET_REQUIRED })
    street: StreetModel

  @NotNull({ message: ERR_MSG_STREET_NUMBER_REQUIRED })
  @NotUndefined({ message: ERR_MSG_STREET_NUMBER_REQUIRED })
    streetNumber: StreetNumberModel

  floorDoor: FloorDoorModel | null | undefined

  constructor(
    zipCode: ZipCodeModel,
    city: CityModel,
    street: StreetModel,
    streetNumber: StreetNumberModel,
    floorDoor?: FloorDoorModel | null
  ) {
    this.zipCode = zipCode
    this.city = city
    this.street = street
    this.streetNumber = streetNumber
    this.floorDoor = floorDoor || null

    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: AddressModel): boolean {
    if (!other) return false
    return (
      this.zipCode.equals(other.zipCode) &&
      this.city.equals(other.city) &&
      this.street.equals(other.street) &&
      this.streetNumber.equals(other.streetNumber) &&
      (
        ((!this.floorDoor && !other.floorDoor) || (this.floorDoor && other.floorDoor && this.floorDoor.equals(other.floorDoor))) || false
      )
      
    )
  }
}
