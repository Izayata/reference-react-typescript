import { AddressModelBuilder } from '../builder/AddressModelBuilder/AddressModelBuilder'
import { CityModel } from '../model/customer/address/CityModel'
import { FloorDoorModel } from '../model/customer/address/FloorDoorModel'
import { StreetModel } from '../model/customer/address/StreetModel'
import { StreetNumberModel } from '../model/customer/address/StreetNumberModel'
import { ZipCodeModel } from '../model/customer/address/ZipCodeModel'
import { AddressModel } from '../model/customer/AddressModel'

interface AddressFields {
  zipCode: string
  city: string
  street: string
  streetNumber: string
  floorDoor: string
}

function buildAddress({ zipCode, city, street, streetNumber, floorDoor }: AddressFields): AddressModel {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel(zipCode))
    .setCity(new CityModel(city))
    .setStreet(new StreetModel(street))
    .setStreetNumber(new StreetNumberModel(streetNumber))
    .setFloorDoor(floorDoor ? new FloorDoorModel(floorDoor) : null)
    .build()
}

export function convertRegistrationFormDataToShippingAddressModel(registrationFormData: {
  shippingZipCode: string,
  shippingCity: string,
  shippingStreet: string,
  shippingStreetNumber: string,
  shippingFloorDoor: string
}): AddressModel {
  return buildAddress({
    zipCode: registrationFormData.shippingZipCode,
    city: registrationFormData.shippingCity,
    street: registrationFormData.shippingStreet,
    streetNumber: registrationFormData.shippingStreetNumber,
    floorDoor: registrationFormData.shippingFloorDoor
  })
}

export function convertRegistrationFormDataToBillingAddressModel(registrationFormData: {
  billingZipCode: string,
  billingCity: string,
  billingStreet: string,
  billingStreetNumber: string,
  billingFloorDoor: string
}): AddressModel {
  return buildAddress({
    zipCode: registrationFormData.billingZipCode,
    city: registrationFormData.billingCity,
    street: registrationFormData.billingStreet,
    streetNumber: registrationFormData.billingStreetNumber,
    floorDoor: registrationFormData.billingFloorDoor
  })
}

export function convertBillingAddressFormToAddressModel(
  billingAddressFormData: {
    billingZipCode: string,
    billingCity: string,
    billingStreet: string,
    billingStreetNumber: string,
    billingFloorDoor: string}
): AddressModel {
  return buildAddress({
    zipCode: billingAddressFormData.billingZipCode,
    city: billingAddressFormData.billingCity,
    street: billingAddressFormData.billingStreet,
    streetNumber: billingAddressFormData.billingStreetNumber,
    floorDoor: billingAddressFormData.billingFloorDoor
  })
}

export function convertShippingAddressFormToAddressModel(
  shippingAddressFormData: {
    shippingZipCode: string,
    shippingCity: string,
    shippingStreet: string,
    shippingStreetNumber: string,
    shippingFloorDoor: string}
): AddressModel {
  return buildAddress({
    zipCode: shippingAddressFormData.shippingZipCode,
    city: shippingAddressFormData.shippingCity,
    street: shippingAddressFormData.shippingStreet,
    streetNumber: shippingAddressFormData.shippingStreetNumber,
    floorDoor: shippingAddressFormData.shippingFloorDoor
  })
}
