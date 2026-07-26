import { EmailModel } from '../model/EmailModel'
import { PasswordModel } from '../model/myUser/PasswordModel'
import { UsernameModel } from '../model/myUser/UsernameModel'
import { CustomerModel } from '../model/CustomerModel'
import { MyUserModel } from '../model/MyUserModel'

export class MyUserModelBuilder {
  private myUsername?: UsernameModel
  private password?: PasswordModel
  private email?: EmailModel
  private customer?: CustomerModel

  setMyUsername(myUsername: UsernameModel) {
    this.myUsername = myUsername
    return this
  }

  setEmail(email: EmailModel) {
    this.email = email
    return this
  }

  setCustomer(customer: CustomerModel) {
    this.customer = customer
    return this
  }

  build() {
    return new MyUserModel(
      this.email!,
      this.myUsername!,
      this.customer!
    )
  }
}
