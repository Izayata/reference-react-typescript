import { RegistrationModelBuilder } from '../builder/RegistrationModelBuilder/RegistrationModelBuilder'
import { RegistrationModel } from '../model/RegistrationModel'
import { convertRegistrationFormDataToBillingAddressModel, convertRegistrationFormDataToShippingAddressModel } from './AddressModelConverter'
import { convertRegistrationDataToMyUserRegistrationModel } from './MyUserRegistrationModelConverter'
import { convertRegistrationDataToPersonalDetailsModel } from './PersonalDetailsConverter'

type RegistrationData =
  Parameters<typeof convertRegistrationDataToMyUserRegistrationModel>[0] &
  Parameters<typeof convertRegistrationDataToPersonalDetailsModel>[0] &
  Parameters<typeof convertRegistrationFormDataToShippingAddressModel>[0] &
  Parameters<typeof convertRegistrationFormDataToBillingAddressModel>[0]

export function convertRegistrationDataToRegistrationModel(registrationData: RegistrationData): RegistrationModel {
  return new RegistrationModelBuilder()
    .setMyUser(convertRegistrationDataToMyUserRegistrationModel(registrationData))
    .setPersonalDetails(convertRegistrationDataToPersonalDetailsModel(registrationData))
    .setShippingAddress(convertRegistrationFormDataToShippingAddressModel(registrationData))
    .setBillingAddress(convertRegistrationFormDataToBillingAddressModel(registrationData))
    .build()
}
