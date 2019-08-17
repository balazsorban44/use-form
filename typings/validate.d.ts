import { Fields } from "./useForm"

/**
 * Validates fields by given validation keys.
 * Those keys must be present in the provided
 * `validators`. Returns the errors.
 */
declare function validate(params: ValidateParams) : Errors

interface ValidateParams {
  fields: Fields
  validators: Validators
  validations?: string[]
  form?: Fields,
  submitting?: Boolean
}


type ValidatorFunction =
/**
 * The parameter is an object, containing all the form's values.
 * It can be used to validate fields dependent on other fields,
 * or custom conditions, but should focus on validating the field
 * with the same fieldKey.
 * Should return `true` if valid.
 */
(fields: Fields) => boolean

interface Errors {
  [fieldKey: string]: boolean
}

export default interface Validators {
  [fieldKey: string]: ValidatorFunction
}