import { RegistrationModel } from '../model/RegistrationModel'
import { AddressModel } from '../model/customer/AddressModel'
import { MyUserRegistrationModel } from '../model/MyUserRegistrationModel'
import { PersonalDetailsModel } from '../model/PersonalDetailsModel'

// Unlike every other builder in this layer, this one is designed to also support being held
// across renders (e.g. via `useRef` in Register.tsx's multi-step wizard) and filled in
// incrementally across separate event handlers. Each `setX` is a plain overwrite, so calling one
// again with a later value is always safe — no `reset()` is needed.
export class RegistrationModelBuilder {
  private myUser?: MyUserRegistrationModel
  private personalDetails?: PersonalDetailsModel
  private shippingAddress?: AddressModel
  private billingAddress?: AddressModel

  setMyUser(myUser: MyUserRegistrationModel) {
    this.myUser = myUser
    return this
  }

  setPersonalDetails(personalDetails: PersonalDetailsModel) {
    this.personalDetails = personalDetails
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
    return new RegistrationModel(
      this.myUser!,
      this.personalDetails!,
      this.shippingAddress!,
      this.billingAddress!
    )
  }
}
