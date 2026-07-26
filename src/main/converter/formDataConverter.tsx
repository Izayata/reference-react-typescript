export function convertRegistrationFormDataToBillingAddressFormData(
  registrationFormData: {
    billingZipCode: string,
    billingCity: string,
    billingStreet: string,
    billingStreetNumber: string,
    billingFloorDoor: string
  }): {
    billingZipCode: string
    billingCity: string
    billingStreet: string
    billingStreetNumber: string
    billingFloorDoor: string
  } {
  return {
    billingZipCode: registrationFormData.billingZipCode,
    billingCity: registrationFormData.billingCity,
    billingStreet: registrationFormData.billingStreet,
    billingStreetNumber: registrationFormData.billingStreetNumber,
    billingFloorDoor: registrationFormData.billingFloorDoor
  }
}

export function convertRegistrationFormDataToShippingAddressFormData(
  registrationFormData: {
    shippingZipCode: string,
    shippingCity: string,
    shippingStreet: string,
    shippingStreetNumber: string,
    shippingFloorDoor: string
  }): {
    shippingZipCode: string
    shippingCity: string
    shippingStreet: string
    shippingStreetNumber: string
    shippingFloorDoor: string
  } {
  return {
    shippingZipCode: registrationFormData.shippingZipCode,
    shippingCity: registrationFormData.shippingCity,
    shippingStreet: registrationFormData.shippingStreet,
    shippingStreetNumber: registrationFormData.shippingStreetNumber,
    shippingFloorDoor: registrationFormData.shippingFloorDoor
  }
}

export function convertBillingAddressFormDataToFormData(
  billingAddressData: {
    billingZipCode: string
    billingCity: string
    billingStreet: string
    billingStreetNumber: string
    billingFloorDoor: string
  }
): {
  zip: string
  city: string
  street: string
  streetNumber: string
  floorDoor: string
} {
  return {
    zip: billingAddressData.billingZipCode,
    city: billingAddressData.billingCity,
    street: billingAddressData.billingStreet,
    streetNumber: billingAddressData.billingStreetNumber,
    floorDoor: billingAddressData.billingFloorDoor
  }
}

export function convertShippingAddressFormDataToFormData(
  shippingAddressData: {
    shippingZipCode: string
    shippingCity: string
    shippingStreet: string
    shippingStreetNumber: string
    shippingFloorDoor: string
  }
): {
  zip: string
  city: string
  street: string
  streetNumber: string
  floorDoor: string
} {
  return {
    zip: shippingAddressData.shippingZipCode,
    city: shippingAddressData.shippingCity,
    street: shippingAddressData.shippingStreet,
    streetNumber: shippingAddressData.shippingStreetNumber,
    floorDoor: shippingAddressData.shippingFloorDoor
  }
}
