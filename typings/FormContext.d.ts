import React from "react"

/** Context that holds the forms */
declare const FormContext : React.ContextType<any>

/**A field value associated with an input field. */
type FieldValue = any

type Form<T> = {
  [K in keyof T]: FieldValue
}

type Forms<T> = {
  [K in keyof T]: Form<T[K]>
}


type FieldValidator<T> = 
  /**
   * The object parameter contains all the form fields.
   * It can be used to validate interdependent fields,,
   * or custom conditions, but should focus on validating the field
   * with the same name as the property name this function is defined on.
   * Should return `true` if the field is valid.
   */
  (fields: T) => Boolean
  
type Validators<T> = {
  [K in keyof T]: FieldValidator<T>
}

type AllValidators<T> = {
  [K in keyof T]: Validators<T[K]>
}

  
type SubmitNotificationType =
  | "submitSuccess"
  | "submitError"


type NotificationType =
  | "validationError"
  | SubmitNotificationType

type NotificationHandler<T> = (type: T) => void

type Fields<T> = {
  [P in keyof T]: T[P]
}

/**
 * Called when a form is submitted.
 * It does a validation on all the fields
 * before it is being sent.
 */
type SubmitFunction<T, N1, F, N2> = (SubmitParams: {
  /** Name of the form that is being submitted */
  name: N2,
  fields: Fields<T>[keyof T]
  /**
   * In case you do an async operation in your submit function,
   * this might come in handy to toggle the loading state.
   * If called with `true`, the `loading` value returned from
   * `useForm` will be also set to `true` and vice versa.
   */
  setLoading: (loading: boolean) => void
  /**
   * If you specified an `onNotify` handler either as a prop
   * of `FormProvider` or on `useForm`, you can trigger it
   * from here with either `"submitSuccess"` or `"submitError"`
   * values.
   */
  notify: N1
}) => void


interface FormProviderProps<T, N1, N2> {
  /**You can utilize useForm anywhere from this element down the tree.*/
  children: React.ReactElement,
  /** Give the initial state of the forms.
   * 
   * @note It "can change", meaning  you can set a default value,
   * and replace it with another value if you receive 
   * this data asynchronously.
   */
  initialState: T
  /**
   * The validators for the forms. Mirrors the structure of `initialState`. 
   */
  validators?: AllValidators<T>
  onNotify?: N1
  submit?: SubmitFunction<T, N2, Form<T>, keyof T>
}

/**
 * Should be declared as high as possible (preferebly in App) in 
 * the component tree to survive unmounts of the form components.
 * This way, the form data is saved, even if the user navigates
 * away from any of the form, as long as the component holding
 * this provider is not unmounted.
 */
declare function FormProvider<
  T extends Forms<Object>,
  N1 extends NotificationHandler<NotificationType>,
  N2 extends NotificationHandler<SubmitNotificationType>
>(props: FormProviderProps<T, N1, N2>) : JSX.Element

export {
  FormContext as default,
  FormProvider
}