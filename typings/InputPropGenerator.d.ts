import * as React from "react"

export type InputTypes =
  | 'text'
  | 'radio'
  | 'email'
  | 'password'
  | 'search'
  | 'color'
  | 'tel'
  | 'url'
  | 'submit'
  | 'date'
  | 'time'
  | 'week'
  | 'month'
  | 'datetimeLocal'
  | 'number'
  | 'range'
  | 'checkbox'
  | 'select'


interface GeneratedProps<T, F, N> {
  id: N
  name: N
  value: F[N]
  type: T extends "datetimeLocal" ? "datetime-local": T
  onChange: React.ChangeEventHandler
}
type GenericObject = { [key: string]: any };

type GeneratePropsFunc<F, N, R, P ={
  name: N
  value: F[N]
  error: boolean
} > = (props: P) => P & R

type InputPropGenerator<
  T, F, N, G = GeneratePropsFunc<F, N, {}>
> = (
  name: N,
  options?: {
    value: T extends "checkbox" | "select" ? string : never
    /**
     * @deprecated
     * `generateProps` will be renamed to extendProps'
     * for the sake of name consistency with useForms().extendProps.
     */
    generateProps: G
    /**
     * Use this instead of `generateProps`.
     * The returned object of this function
     * will be merged with the rest of other props.
     * @note
     * If you have a useForm().extendProps defined,
     * this will override those values.
     */
    extendProps: G
    /** Override the name of the form being submitted. */
    formName: T extends "submit" ? string : never
  }
) => GeneratedProps<T, F, N> | ReturnType<G>

export type InputPropGenerators<F> = {
  [K in InputTypes]: InputPropGenerator<K, F, keyof F>
}

