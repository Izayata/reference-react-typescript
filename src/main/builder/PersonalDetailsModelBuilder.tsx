import { FirstnameModel } from '../model/customer/FirstnameModel'
import { LastnameModel } from '../model/customer/LastnameModel'
import { PhoneNumberModel } from '../model/customer/PhoneNumberModel'
import { PersonalDetailsModel } from '../model/PersonalDetailsModel'

export class PersonalDetailsModelBuilder {
  private firstname?: FirstnameModel
  private lastname?: LastnameModel
  private phoneNumber?: PhoneNumberModel

  setFirstname(firstname: FirstnameModel) {
    this.firstname = firstname
    return this
  }

  setLastname(lastname: LastnameModel) {
    this.lastname = lastname
    return this
  }

  setPhoneNumber(phoneNumber: PhoneNumberModel) {
    this.phoneNumber = phoneNumber
    return this
  }

  build() {
    return new PersonalDetailsModel(
      this.firstname!,
      this.lastname!,
      this.phoneNumber!
    )
  }
}
