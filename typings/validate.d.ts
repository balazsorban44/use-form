import {Validators, Errors } from "./Validators"
import { FieldValues } from "./FormData"

export interface ValidateParams<F> {
  fields: Partial<F>
  validators: Validators<F>
  validations?: string[]
  form?: F,
  submitting?: Boolean
}

/**
 * Validates fields by given validation keys.
 * Those keys must be present in the provided
 * `validators`. Returns the errors.
 */
declare function validate<
  F extends FieldValues,
  V extends ValidateParams<F>
>(validateParams: V) : Errors<V["fields"]>

export default validate