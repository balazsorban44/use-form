import * as React from "react"
import { Validators } from "./Validators"
import { FieldValues, FieldValuesAndErrors } from "./FormData"
import { NotifyCallback, SubmitNotificationType } from "./Notification"


export type SubmitCallback<N, F, T = any> = (submitParams: {
  name?: N
  /** Validated field values */
  fields: F
  /**
   * Controls the value of `useForm().loading`.
   *
   * Eg.: set to `true`, when performing an async task,
   * and to `false` when finished.
   */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  /** Notify the user about the state of submitting. */
  notify: NotifyCallback<F, SubmitNotificationType>
}) => T

/**
 * Set up a form, or hook into one deifned in `FormProvider`.
 */
declare function useForm<
  N extends string,
  F extends FieldValues,
  V extends Validators<F>,
  S extends SubmitCallback<N, F>
>(useFormParams: {
  /**
   * Providing a name gives you access to
   * one of your forms defined in `FormProvider`.
   * If you leave it blank, you must provide
   * `initialState`, `validators`, `onChange` and `onSubmit` here.
   *
   * @note The name is also returned in `onSubmit` for convenience.
   *
   * @example
   * const initialStates = { profile: { age: 24 } }
   *
   * <FormProvider initialStates={initialStates}>
   *
   *  //... somewhere in a component down the tree
   *  const form = useForm({name: "profile"})
   *  console.log(form.fields.age.value) // 24
   *
   * </FormProvider>
   */
  name: N
  /**
   * An object that defines the **shape** of the form
   * with some initial values.
   * Every field defined in `initialState` must have
   * a corresponding validator in `validators`.
   *
   * @note You can pass multiple `initialState` objects
   * to `FormProvider`.
   */
  initialState?: F
  /**
   * A function that returns an object of validators.
   * Each returned property is a validator for either
   * a field value, or they can be more complex and
   * validate the correlation between field values.
   *
   * @note
   * All the fields defined in `initialState`
   * must have a validator.
   * The validator's property name
   * must match the fields's property name.
   *
   * @note You can pass multiple `validators` to `FormProvider`.
   *
   * @example
   * // For a more understandable example, we use date-fns's
   * // isAfter() and differenceInDays(), but it is not mandatory.
   * import {isAfter, differenceInDays} from "date-fns"
   *
   * const Component = () => {
   *    const form = useForm({
   *      initialState: { departure: "2019-09-25", arrival: "2019-09-26" },
   *      validators: fields => {
   *        const now = Date.now()
   *        const tomorrow = addDays(now, 1)
   *        return ({
   *          arrival: isAfter(fields.arrival, now),
   *          departure: isAfter(fields.departure, now),
   *          minOneNight: differenceInDays(fields.departure, fields.arrival) >= 1
   *        })
   *      }
   *    })
   *
   *    const value = form.fields.departure.value
   *    return (
   *      <input
   *        name="departure"
   *        value={value}
   *        onChange={e => form.handleChange(e, ["departure", "minOneNight"])}
   *      />
   *    )
   * }
   */
  validators?: V
  /** Invoked when submitting the form. */
  onSubmit?: S
  /**
   * Invoked when the user should be notified.
   * (Eg.: Invalid input, submit error or submit success)
   */
  onNotify?: NotifyCallback<F>
}) : UseForm<N, F, keyof ReturnType<V>, S>


export interface UseForm<N, F, V, OnSubmitCallback> {
  /** Name of the form */
  name: N
  /**
   * An object containing all the fields' values and
   * if they are valid.
   */
  fields: FieldValuesAndErrors<F>
  /** Call it to respond to input changes. */
  handleChange(
    /**
     * An object. The property names must correspond
     * to one of the fields in `initialState`.
     */
    fields: Partial<F>,
    /**
     * When field values change, they are validated
     * automatically. By default, only validations with
     * corresponding names are run, but you can override
     * which validations to run here.
     */
    validations?: Array<V>
    ): void
  /** Call it to respond to input changes. */
  handleChange(
    /**
     * event.target.{name, value, type, checked} are used
     * to infer the intended change.
     */
    event: React.FormEvent,
    /**
     * When field values change, they are validated
     * automatically. By default, only validations with
     * corresponding names are run, but you can override
     * which validations to run here.
     */
    validations?: Array<V>
  ): void
  /**
   * Invokes `onSubmit`. Before that, it runs all field
   * validations, and if any of them fails, a notification
   * is emitted with type `validationErrors` and a list of
   * failed validations.
   *
   * @note If an event is passed as an argument, preventdefault()
   * is called automatically.
   */
  handleSubmit: (event?: React.FormEvent) => ReturnType<OnSubmitCallback>
  /**
   * Tells if there is some async operation running in the form,
   * like sending data to server. Can be used to for example disable
   * the UI while something happens that we should wait for.
   */
  loading: boolean
}

export default useForm