import Validators, { Fields, FieldKey } from "./validate"


export interface Fields {
  [fieldKey: string]: any
}

/** Hook to set up a form. */
declare function useForm({
  name, validators, submit,
  onFinished, onNotify, context,
  validations, validatorObject
}: UseFormParams) : UseForm

interface UseFormParams {
  /**
   * Determine which form should we hook into in the Forms Context.
   * This makes it possible to handle multiple forms.
   * (Each form should have their own unique names.)
   */
  name: string
  /**
   * An object containing validator functions.
   * Can be used to test interdependent fields.
   * It should at least contain a validator function
   * for each form field. The key of the validator function is
   * the same as the form field's that it is testing.
   * (eg.: fields.email -> validators.email)
   *
   * A validator function returns `true`
   * if the field(s) it is testing are valid.
   */
  validators: Validators
  /** Function called to submit the form. */
  submit: SubmitFunction
  /**
   * An optional callback function,
   * invoked when a submission has been successfully submitted.
   */
  onFinished?: Function
  /** Invoked if something happened that the user should be informed about. */
  onNotify?: OnNotifyCallback
  /**
   * Context is used internally. You set it up with `FormProvider`.
   * However, if you already have one you like to use for forms,
   * you can pass it here.
   * 
   * For implementation details follow this link:
   * @see https://github.com/balazsorban44/use-form#usage
   */
  context?: React.Context<any>
  /** @deprecated Not needed anymore. */
  validations?: string[]
  /** @deprecated Plase use `validators` instead. */
  validatorObject: Validators
}


interface UseForm {
  /**
   * All of the form field values.
   * Also contains information about
   * invalid values.
   */
  fields: FieldValuesAndErrors
  /** For handling field changes, with field validation. */
  handleChange (
    /** Object of fields that has changed. */
    fields: Fields,
    /**
     * Optional list of validations to execute
     * with the new field value(s).
     * The strings must correspond to
     * one of the validator in the validators object.
     */
    validations?: string[]
  ): any
  handleChange (
    /** Form event */
    fields: React.FormEvent,
    /**
      * Optional list of validations to execute
      * with the new field value(s).
      * The strings must correspond to
      * one of the validator in the validators object.
      */
    validations?: string[]
  ): any
  /**
   * Simple submit function infused with full form validation,
   * that fails if something is invalid or broken.
   */
  handleSubmit: React.FormEventHandler
  /**
   * Tells if there is some async operation running in the form,
   * like sending data to server. Can be used to for example disable
   * the UI while something happens that we should wait for.
   */
  loading: boolean
}

interface FieldsMetadata {
  /**
   * If any of the fields did not pass validation,
   * this is set to `true`.
   */
  hasErrors: boolean
}


interface FieldValueAndError {
  /** The field's value. */
  value: any
  /** `true` if the field value is invalid. */
  error?: boolean
}

interface FieldValuesAndErrors {
  /** Contains information about the fields. */
  metadata: FieldsMetadata
  [fieldKey: string]: FieldValueAndError
}

type SubmitFunction = (params : SubmitFunctionParams) => Promise<boolean>

interface SubmitFunctionParams {
  /**
   * The fully validated form fields,
   * ready to be sent to the database.
   */
  fields: Fields
  /** Control loading state. */
  setLoading: (isLoading: boolean) => Function
  /**
   * Call it in the successful branch of your `submit` function.
   * It will try to invoke `onNotify('submitSuccess')`
   * and `onFinished` if was defined.
   */
  finish: Function
}


type OnNotifyCallback = (
  /** Type of notification */
  type: 'validationError' | 'submitError' | 'submitSuccess',
  /** If `type` is validationError, than key defines which validation failed. */
  fieldKey?: string
) => void


export default useForm
