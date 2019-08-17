import React, { createContext, useReducer, useEffect, useRef, useContext, useMemo } from 'react'
import handleDevErrors, { errors } from './handleDevErrors'
import reducer from './reducer'

const FormContext = createContext()

function FormProvider({
  children,
  initialState = {},
  validators = undefined,
  onSubmit = undefined,
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


function useFormContext(name, initialState) {
  const [form, dispatch] = useReducer(reducer, initialState)
  const context = useContext(FormContext)

  if (!name) return { form, dispatch }

  if (process.env.NODE_ENV !== 'production')
    if (!context) throw new Error(errors.outsideProvider)

  const { forms, validators, ...rest } = context

  return {
    form: forms?.[name],
    validators: validators?.[name],
    ...rest
  }
}


export {
  FormProvider,
  useFormContext
}

