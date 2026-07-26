import { RegistrationModelBuilder } from '../builder/RegistrationModelBuilder'
import { RegistrationModel } from '../model/RegistrationModel'
import { convertRegistrationFormDataToBillingAddressModel, convertRegistrationFormDataToShippingAddressModel } from './AddressModelConverter'
import { convertRegistrationDataToMyUserRegistrationModel } from './MyUserRegistrationModelConverter'
import { convertRegistrationDataToPersonalDetailsModel } from './PersonalDetailsConverter'

export function convertRegistrationDataToRegistrationModel(registrationData: any): RegistrationModel {
  return new RegistrationModelBuilder()
    .setMyUser(convertRegistrationDataToMyUserRegistrationModel(registrationData))
    .setPersonalDetails(convertRegistrationDataToPersonalDetailsModel(registrationData))
    .setShippingAddress(convertRegistrationFormDataToShippingAddressModel(registrationData))
    .setBillingAddress(convertRegistrationFormDataToBillingAddressModel(registrationData))
    .build()
}
