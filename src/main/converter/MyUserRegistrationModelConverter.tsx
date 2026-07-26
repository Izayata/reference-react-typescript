import { MyUserRegistrationModelBuilder } from '../builder/MyUserRegistrationModelBuilder'
import { EmailModel } from '../model/EmailModel'
import { UsernameModel } from '../model/myUser/UsernameModel'
import { MyUserRegistrationModel } from '../model/MyUserRegistrationModel'
import { convertRegistrationDataToNewPasswordDetailsModel } from './NewPasswordDetailsModel'

export function convertRegistrationDataToMyUserRegistrationModel(registrationData: any): MyUserRegistrationModel {
  return new MyUserRegistrationModelBuilder()
    .setMyUsername(new UsernameModel(registrationData.username))
    .setNewPasswordDetails(convertRegistrationDataToNewPasswordDetailsModel(registrationData))
    .setEmail(new EmailModel(registrationData.email))
    .build()
}