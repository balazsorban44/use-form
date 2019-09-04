import Validators from "./validate"


export interface Fields {
  [fieldKey: string]: any
}

/** Hook to set up a form. */
declare function useForm(useFormParams: {
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
   * @note You can also pass the validators to the
   * FormProvider.
   */
  validators?: Validators
  /** Function called to submit the form. */
  onSubmit?: SubmitFunction
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
}) : UseForm


export interface UseForm {
  /**
   * All of the form field values.
   * Also contains information about
   * invalid values.
   */
  fields: FieldValuesAndErrors
  /**
   * The change handler.
   * Can take multiple values at once as well. In that case,
   * the first parameter must be an object that will be
   * merged with the form. It also validates the field(s)
   * that are passed.
   */
  handleChange(
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
    event: React.FormEvent,
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

type SubmitFunction = ({fields, setLoading, finish} : SubmitFunctionParams) => Promise<boolean>

interface SubmitFunctionParams {
  /**
   * The fully validated form fields,
   * ready to be sent to the database.
   */
  fields: Fields
  /** Control loading state. */
  setLoading: (isLoading: boolean) => Function
  notify: OnNotifyCallback<SubmitNotificationType, keyof Fields>
  /**
   * Call it in the successful branch of your `submit` function.
   * It will try to invoke `onNotify('submitSuccess')`
   * and `onFinished` if was defined.
   */
  finish: Function
}

type SubmitNotificationType = 'submitError' |
'submitSuccess'

type NotificationType = 
  'validationErrors' |
  SubmitNotificationType



export type OnNotifyCallback<T=NotificationType, F=string> = (
  /** Type of notification */
  type: T,
  /** If `type` is validationErrors, than key defines which validation failed. */
  fieldKey?: F
) => void


export default useForm

