import React from "react"

/** Context that holds forms by default */
declare const FormContext : React.Context<Object>

declare function reducer(state: React.ReducerState<any>, action: React.ReducerAction<any>) : Object

/**
 * Should be declared as high as possible (preferebly in App) in 
 * the component tree to survive unmounts of the form components.
 * This way, the form data is saved, even if the user navigates
 * away from any of the form, as long as the component holding
 * this provider is not unmounted.
 */
declare function FormProvider(props: FormProviderProps) : JSX.Element

export {
  FormContext as default,
  FormProvider
}


interface FormProviderProps<T extends {[name: string]: Object}>{
  children: React.ReactElement,
  /** Give the initial state of the forms.
   * 
   * NOTE: It "can change", meaning  you can set a default value,
   * and replace it with another value if you receive 
   * this data asynchronously.
   */
  initialState: T
  /**
   * The validators for the forms. Mirrors the structure of `initialState`. 
   */
  validators?: T
}

interface Action {
  type: string,
  payload: any
}