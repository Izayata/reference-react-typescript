import { CustomerModel } from '../../model/CustomerModel'
import { AddressModel } from '../../model/customer/AddressModel'
import { EmailModel } from '../../model/EmailModel'
import { PersonalDetailsModel } from '../../model/PersonalDetailsModel'

export class CustomerModelBuilder {
  private personalDetails?: PersonalDetailsModel
  private email?: EmailModel

  private shippingAddress?: AddressModel
  private billingAddress?: AddressModel

  setPersonalDetails(personalDetails: PersonalDetailsModel) {
    this.personalDetails = personalDetails
    return this
  }

  setEmail(email: EmailModel) {
    this.email = email
    return this
  }

  setShippingAddress(address: AddressModel) {
    this.shippingAddress = address
    return this
  }

  setBillingAddress(address: AddressModel) {
    this.billingAddress = address
    return this
  }

  build() {
    return new CustomerModel(
      this.personalDetails!,
      this.email!,
      this.shippingAddress!,
      this.billingAddress!
    )
  }
}
