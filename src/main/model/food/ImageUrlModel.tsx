import { validateSync } from "class-validator";
import { NotBlank } from "../../myDecorators/NotBlank";
import { ERR_MSG_IMAGE_URL_VALUE_REQUIRED } from "../../utils/food/ImageUrlUtils";

export class ImageUrlModel {
  @NotBlank({ message: ERR_MSG_IMAGE_URL_VALUE_REQUIRED })
  value: string

  constructor(value: string) {
    this.value = value;
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw errors;
    }
  }
}
