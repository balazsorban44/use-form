/**
 * Validates fields by given validation keys.
 * Those keys must be present in the provided
 * validatorObject.
 */
declare function validate(params: {
  fields: Object,
  validatorObject: ValidatorObject,
  validations?: string[],
  handleError?: HandleValidateErrorFunction | null
}) : boolean


export interface ValidatorObject {
  [fieldName: string]: FieldValidatorFunction
}

/** TODO: */
type HandleValidateErrorFunction = () => null

type FieldValidatorFunction = 
/**
 * The parameters are all the fields in the given form.
 * It can be used to validate fields dependent on other fields,
 * or custom conditions, but should focus on validating the field
 * with the same fieldName.
 * Should return `true` if valid.
 */
(fields: {[fieldName: string]: any}) => boolean


export default validate