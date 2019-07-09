
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


interface FormProviderProps {
  children: React.ReactElement,
  /** Give the initial state of the forms */
  initialState?: {
    [name: string]: Object
  }
}

interface Action {
  type: string,
  payload: any
}