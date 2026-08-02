import { EmailModel } from '../../model/EmailModel'
import { UsernameModel } from '../../model/myUser/UsernameModel'
import { MyUserRegistrationModel } from '../../model/MyUserRegistrationModel'
import { NewPasswordDetailsModel } from '../../model/NewPasswordDetailsModel'

export class MyUserRegistrationModelBuilder {
  private email?: EmailModel
  private myUsername?: UsernameModel
  private newPasswordDetails?: NewPasswordDetailsModel

  setEmail(email: EmailModel) {
    this.email = email
    return this
  }

  setMyUsername(myUsername: UsernameModel) {
    this.myUsername = myUsername
    return this
  }

  setNewPasswordDetails(newPasswordDetails: NewPasswordDetailsModel) {
    this.newPasswordDetails = newPasswordDetails
    return this
  }

  build() {    
    return new MyUserRegistrationModel(
      this.email!,
      this.myUsername!,
      this.newPasswordDetails!
    )
  }
}

