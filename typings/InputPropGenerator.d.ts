import * as React from "react"

type InputTypes =
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


type GeneratePropsFunc<T, F, N, R, P ={
  name: N
  value: F[N]
  error: boolean
} > = (props: P) => P & R

type InputPropGenerator<
  T, F, N, G = GeneratePropsFunc<T, F, N, {}>
> = (
  name: N,
  options?: {
    value: T extends "checkbox" | "select" ? string : never
    generateProps: G
    /** Override the name of the form being submitted. */
    formName: T extends "submit" ? string : never
  }
) => GeneratedProps<T, F, N> | ReturnType<G>

export type InputPropGenerators<F> = {
  [K in InputTypes]: InputPropGenerator<K, F, keyof F>
}

