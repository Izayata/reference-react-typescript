import { ImageUrlModel } from '../../../main/model/food/ImageUrlModel'
import { ERR_MSG_IMAGE_URL_VALUE_REQUIRED } from '../../../main/utils/food/ImageUrlUtils'
import { expectErrorMessages } from '../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_IMAGE_URL_MODEL_UNDEFINED = () => new ImageUrlModel(undefined as any)
const ERR_IMAGE_URL_MODEL_NULL = () => new ImageUrlModel(null as any)
const ERR_IMAGE_URL_MODEL_EMPTY = () => new ImageUrlModel('')
const ERR_IMAGE_URL_MODEL_SPACE_ONLY = () => new ImageUrlModel('   ')

// Valid cases
const VALID_IMAGE_URL_MODEL = () => new ImageUrlModel('https://example.com/image.jpg')
const VALID_IMAGE_URL_MODEL_HTTP = () => new ImageUrlModel('http://example.com/image.jpg')
const VALID_IMAGE_URL_MODEL_PATH = () => new ImageUrlModel('/images/food/123.png')

describe('ImageUrlModel', () => {
  
  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined', () => {
    expectErrorMessages(
      ERR_IMAGE_URL_MODEL_UNDEFINED,
      [ERR_MSG_IMAGE_URL_VALUE_REQUIRED],
      1
    )
  })

  it('should throw required error for null', () => {
    expectErrorMessages(
      ERR_IMAGE_URL_MODEL_NULL,
      [ERR_MSG_IMAGE_URL_VALUE_REQUIRED],
      1
    )
  })

  it('should throw required error for empty string', () => {
    expectErrorMessages(
      ERR_IMAGE_URL_MODEL_EMPTY,
      [ERR_MSG_IMAGE_URL_VALUE_REQUIRED],
      1
    )
  })

  it('should throw required error for space-only string', () => {
    expectErrorMessages(
      ERR_IMAGE_URL_MODEL_SPACE_ONLY,
      [ERR_MSG_IMAGE_URL_VALUE_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ###### 
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid https image url', () => {
    expect(VALID_IMAGE_URL_MODEL).not.toThrow()
  })

  it('should accept valid http image url', () => {
    expect(VALID_IMAGE_URL_MODEL_HTTP).not.toThrow()
  })

  it('should accept valid image path', () => {
    expect(VALID_IMAGE_URL_MODEL_PATH).not.toThrow()
  })
})
