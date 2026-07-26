import { AddressModelBuilder } from '../builder/AddressModelBuilder'
import { CityModel } from '../model/customer/address/CityModel'
import { FloorDoorModel } from '../model/customer/address/FloorDoorModel'
import { StreetModel } from '../model/customer/address/StreetModel'
import { StreetNumberModel } from '../model/customer/address/StreetNumberModel'
import { ZipCodeModel } from '../model/customer/address/ZipCodeModel'
import { AddressModel } from '../model/customer/AddressModel'

export function convertRegistrationFormDataToShippingAddressModel(registrationFormData: any): AddressModel {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel(registrationFormData.shippingZipCode))
    .setCity(new CityModel(registrationFormData.shippingCity))
    .setStreet(new StreetModel(registrationFormData.shippingStreet))
    .setStreetNumber(new StreetNumberModel(registrationFormData.shippingStreetNumber))
    .setFloorDoor(registrationFormData.shippingFloorDoor ? new FloorDoorModel(registrationFormData.shippingFloorDoor) : null)
    .build()
}

export function convertRegistrationFormDataToBillingAddressModel(registrationFormData: any): AddressModel {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel(registrationFormData.billingZipCode))
    .setCity(new CityModel(registrationFormData.billingCity))
    .setStreet(new StreetModel(registrationFormData.billingStreet))
    .setStreetNumber(new StreetNumberModel(registrationFormData.billingStreetNumber))
    .setFloorDoor(registrationFormData.billingFloorDoor ? new FloorDoorModel(registrationFormData.billingFloorDoor) : null)
    .build()
}

export function convertBillingAddressFormToAddressModel(
  billingAddressFormData: {
    billingZipCode: string,
    billingCity: string,
    billingStreet: string,
    billingStreetNumber: string,
    billingFloorDoor: string}
): AddressModel {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel(billingAddressFormData.billingZipCode))
    .setCity(new CityModel(billingAddressFormData.billingCity))
    .setStreet(new StreetModel(billingAddressFormData.billingStreet))
    .setStreetNumber(new StreetNumberModel(billingAddressFormData.billingStreetNumber))
    .setFloorDoor(billingAddressFormData.billingFloorDoor ? new FloorDoorModel(billingAddressFormData.billingFloorDoor) : null)
    .build()
}

export function convertShippingAddressFormToAddressModel(
  shippingAddressFormData: {
    shippingZipCode: string,
    shippingCity: string,
    shippingStreet: string,
    shippingStreetNumber: string,
    shippingFloorDoor: string}
): AddressModel {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel(shippingAddressFormData.shippingZipCode))
    .setCity(new CityModel(shippingAddressFormData.shippingCity))
    .setStreet(new StreetModel(shippingAddressFormData.shippingStreet))
    .setStreetNumber(new StreetNumberModel(shippingAddressFormData.shippingStreetNumber))
    .setFloorDoor(shippingAddressFormData.shippingFloorDoor ? new FloorDoorModel(shippingAddressFormData.shippingFloorDoor) : null)
    .build()
}
