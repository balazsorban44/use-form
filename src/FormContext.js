import React, { createContext, useReducer, useEffect, useRef, useContext, useMemo } from 'react'
import handleDevErrors, { errors } from './handleDevErrors'

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
  submit = undefined,
  onNotify = undefined
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
    onSubmit
  }), [forms, onNotify, onSubmit, validators])

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  )
}


function useFormContext(name) {

  const context = useContext(FormContext)

  if (process.env.NODE_ENV !== 'production')
    if (!context) throw new Error(errors.outsideProvider)

  const {
    forms,
    validators,
    ...rest
  } = context

  return useMemo(() => ({
    form: forms?.[name],
    validators: validators?.[name],
    ...rest
  }), [forms, name, rest, validators])
}


export {
  FormProvider,
  useFormContext
}

