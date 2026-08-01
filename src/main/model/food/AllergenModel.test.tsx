import { AllergenModel } from './AllergenModel'
import { AllergenNameModel } from './allergen/AllergenNameModel'
import {
  ERR_MSG_ALLERGEN_ID_REQUIRED,
  ERR_MSG_ALLERGEN_NAME_REQUIRED
} from '../../utils/food/AllergenUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Valid AllergenNameModel for use in valid/invalid AllergenModel tests
const VALID_ALLERGEN_NAME_MODEL = new AllergenNameModel('Allergen')
const VALID_ALLERGEN_ICON_NAME = 'iconName'

// Invalid cases
const ERR_ALLERGEN_MODEL_ID_UNDEFINED = () => new AllergenModel(
  undefined as any,
  VALID_ALLERGEN_NAME_MODEL,
  VALID_ALLERGEN_ICON_NAME
)
const ERR_ALLERGEN_MODEL_ID_NULL = () => new AllergenModel(
  null as any,
  VALID_ALLERGEN_NAME_MODEL,
  VALID_ALLERGEN_ICON_NAME
)
const ERR_ALLERGEN_MODEL_NAME_UNDEFINED = () => new AllergenModel(
  1, 
  undefined as any,
  VALID_ALLERGEN_ICON_NAME
)
const ERR_ALLERGEN_MODEL_NAME_NULL = () => new AllergenModel(
  1, 
  null as any,
  VALID_ALLERGEN_ICON_NAME
)

// Valid case
const VALID_ALLERGEN_MODEL = () => new AllergenModel(1, VALID_ALLERGEN_NAME_MODEL, VALID_ALLERGEN_ICON_NAME)

describe('AllergenModel', () => {
  
  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for null id', () => {
    expectErrorMessages(
      ERR_ALLERGEN_MODEL_ID_NULL,
      [ERR_MSG_ALLERGEN_ID_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined id', () => {
    expectErrorMessages(
      ERR_ALLERGEN_MODEL_ID_UNDEFINED,
      [ERR_MSG_ALLERGEN_ID_REQUIRED],
      1
    )
  })

  it('should throw required error for null name', () => {
    expectErrorMessages(
      ERR_ALLERGEN_MODEL_NAME_NULL,
      [ERR_MSG_ALLERGEN_NAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined name', () => {
    expectErrorMessages(
      ERR_ALLERGEN_MODEL_NAME_UNDEFINED,
      [ERR_MSG_ALLERGEN_NAME_REQUIRED],
      1
    )
  })

  
  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid allergen model', () => {
    expect(VALID_ALLERGEN_MODEL).not.toThrow()
  })
})
