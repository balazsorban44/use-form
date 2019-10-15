export interface FieldValueAndError<V> {
  /** The field's value. */
  value: V
  /**
   * `true` if the field value is invalid.
   **/
  error?: boolean
}

export type FieldValues<F = {}> = {
  [K in keyof F]: F[K]
}

export type FieldValuesAndErrors<F = {}> = {
  [K in keyof F]: FieldValueAndError<F[K]>
}