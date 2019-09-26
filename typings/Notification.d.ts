export type SubmitError = 'submitError'

export type ValidationErrors = 'validationErrors'

export type SubmitNotificationType = SubmitError | 'submitSuccess'

export type NotificationType = ValidationErrors | SubmitNotificationType

export type Reason<S,F> = S extends SubmitError ? string : S extends ValidationErrors ? Array<keyof F> : undefined

export type NotifyCallback<F, S extends NotificationType = NotificationType> = (
  /** Type of notification */
  type: S,
  /** 
   * If type is `submitError`
   * you can pass a reason for why submitting failed.
   * 
   * If it is `validationErrors`,
   * the reason will be a list of fields that
   * did not pass their validation.
   * 
   */
  reason?: Reason<S, F>
) => void