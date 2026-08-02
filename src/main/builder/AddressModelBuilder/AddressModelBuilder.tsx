import { AddressModel } from '../../model/customer/AddressModel'
import { CityModel } from '../../model/customer/address/CityModel'
import { FloorDoorModel } from '../../model/customer/address/FloorDoorModel'
import { StreetModel } from '../../model/customer/address/StreetModel'
import { StreetNumberModel } from '../../model/customer/address/StreetNumberModel'
import { ZipCodeModel } from '../../model/customer/address/ZipCodeModel'

export class AddressModelBuilder {
  private zipCode?: ZipCodeModel
  private city?: CityModel
  private street?: StreetModel
  private streetNumber?: StreetNumberModel
  private floorDoor?: FloorDoorModel | null

  setZipCode(zipCode: ZipCodeModel) {
    this.zipCode = zipCode
    return this
  }

  setCity(city: CityModel) {
    this.city = city
    return this
  }

  setStreet(street: StreetModel) {
    this.street = street
    return this
  }

  setStreetNumber(streetNumber: StreetNumberModel) {
    this.streetNumber = streetNumber
    return this
  }

  setFloorDoor(floorDoor: FloorDoorModel | null) {
    this.floorDoor = floorDoor
    return this
  }

  build() {
    return new AddressModel(
      this.zipCode!,
      this.city!,
      this.street!,
      this.streetNumber!,
      this.floorDoor
    )
  }
}
