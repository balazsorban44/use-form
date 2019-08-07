import React, { createContext, useReducer, useEffect, useRef, useContext, useMemo } from 'react'

const FormContext = createContext()

function reducer(state, { type, payload }) {
  return (type in state) ?
    { ...state, [type]: { ...state[type], ...payload } } :
    { ...state, ...payload }
}

function FormProvider({
  children,
  initialState = {},
  validators = undefined,
  onNotify = null,
  submit = null
}) {
  const [forms, dispatch] = useReducer(reducer, initialState)

  /**
   * We override initialState if the prop has changed.
   * Useful for asynchronously fetched initialStates.
   */
  const initialStateRef = useRef(initialState)
  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(initialStateRef.current)) {
      dispatch({ payload: initialState })
    }
  }, [initialState])

  const value = useMemo(() => ({
    forms,
    dispatch,
    validators,
    onNotify,
    submit
  }), [forms, onNotify, submit, validators])

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  )
}


function useFormContext(name) {

  const context = useContext(FormContext)

  if (process.env.NODE_ENV !== 'production')
    if (!context) throw new Error('useForm must be used inside a FormProvider')

  const { forms, validators } = context

  return useMemo(() => ({
    form: forms?.[name],
    validators: validators?.[name],
    ...context
  }), [context, forms, name, validators])
}


export {
  FormProvider,
  useFormContext
}

