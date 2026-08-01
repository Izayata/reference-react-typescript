import { EmailModel } from '../model/EmailModel'
import { UsernameModel } from '../model/myUser/UsernameModel'
import { CustomerModel } from '../model/CustomerModel'
import { MyUserModel } from '../model/MyUserModel'

export class MyUserModelBuilder {
  private email?: EmailModel
  private myUsername?: UsernameModel
  private customer?: CustomerModel

  setEmail(email: EmailModel) {
    this.email = email
    return this
  }

  setMyUsername(myUsername: UsernameModel) {
    this.myUsername = myUsername
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
