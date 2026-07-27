import { PersonalDetailsModelBuilder } from '../builder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../model/customer/FirstnameModel'
import { LastnameModel } from '../model/customer/LastnameModel'
import { PhoneNumberModel } from '../model/customer/PhoneNumberModel'
import { PersonalDetailsModel } from '../model/PersonalDetailsModel'

export function convertRegistrationDataToPersonalDetailsModel(registrationData: {
  firstname: string
  lastname: string
  phoneNumber: string
}): PersonalDetailsModel {
  return new PersonalDetailsModelBuilder()
    .setFirstname(new FirstnameModel(registrationData.firstname))
    .setLastname(new LastnameModel(registrationData.lastname))
    .setPhoneNumber(new PhoneNumberModel(registrationData.phoneNumber))
    .build()
}

export function convertPersonalDetailsFormDataToPersonalDetailsModel(
  personalDetailsFormData: {
    firstname: string
    lastname: string
    phoneNumber: string
  }
): PersonalDetailsModel {
  return new PersonalDetailsModelBuilder()
    .setFirstname(new FirstnameModel(personalDetailsFormData.firstname))
    .setLastname(new LastnameModel(personalDetailsFormData.lastname))
    .setPhoneNumber(new PhoneNumberModel(personalDetailsFormData.phoneNumber))
    .build()
}
