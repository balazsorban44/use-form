import { ValidatorObject } from "./validate"

/** Hook to set up a form. */
declare function useForm({
  name,
  submit,
  onFinished,
  onNotify,
  validations,
  validatorObject
}: UseFormParams) : FormInformation



interface UseFormParams {
  /**
   * More of a namespace, to determine location of the form in the context's state. 
   * It is important that the name is the same as the object key
   * in the reducer to the object containing the fields.
   */
  name: string
  /** Function called on submiting. */
  submit: SubmitFunction
  onFinished: OnFinishedCallback
  /** Called if something hapened the user should know about. */
  onNotify: OnNotifyCallback
  /** Defaults to the field object's keys, but can define more, for interconnected field value validations. */
  validations?: string[]
  /** An object containing validator functions. Can be verbose, to test fields that are interconnected. */
  validatorObject?: ValidatorObject,
  /** 
   * If provided, you can define to which Context you want to save the form data. It uses useReducer()
   * internally, so you should provde a dispatch method in your Context as well.
   * TODO: Document better.
   */
  context?: React.Context<any>
}


interface FormInformation {
  fields: {
    metadata: FieldMetadata,
    /** Form field, returning a value and an error boolean if the value is invalid. */
    [name: string]: Field | FieldMetadata
  }
  /** To handle field changes, with field validation. */
  handleChange: (
    /** Fields that has changed */
    field: {
      [name: string]: string | number
    },
    /** Optional list of validations to execute. The string must correspond to any of the validatorObject's validator */
    validations?: string[]
  ) => void
  /** Simple submit function infused with full form validation, that fails if something is invalid or broken. */
  handleSubmit: React.FormEventHandler
  /** Tells if there is some async operation running in the form, like sending data to server. */
  loading: boolean
}

interface FieldMetadata {
  /** If any of the fields did not pass validation, this is set to true. */
  hasErrors: boolean
}


export interface Field {
  /** The field's value. */
  value: string | number
  /** `true` if the field value is invalid. */
  error?: boolean
}

/**TODO: */
type SubmitFunction = ({
  fields,
  setLoading,
  finish
} : {
  /** The fully validated form fields, ready to be sent to the database. */
  fields: {
    [key: string]: string | number
  }
  /** Control loading. */
  setLoading: (isLoading: boolean) => Function
  /** Callback intended to call when all operation is finished. */
  finish: () => Function
}) => Promise<boolean>


/**TODO: */
type OnFinishedCallback = () => void

/**TODO: */
type OnNotifyCallback = () => void

export default useForm