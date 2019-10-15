import React, { createContext, useReducer, useEffect, useRef, useContext, useMemo } from 'react'
import { errors } from './handleDevErrors'
import reducer from './reducer'

const FormContext = createContext()

function FormProvider({
  children,
  initialStates = {},
  validators = undefined,
  onSubmit = undefined,
  onNotify = undefined
}) {
  const [forms, dispatch] = useReducer(reducer, initialStates)

  /**
   * We override initialStates if the prop has changed.
   * Useful for asynchronously fetched initialState.
   */
  const initialStatesRef = useRef(initialStates)
  useEffect(() => {
    if (
      JSON.stringify(initialStates) !== JSON.stringify(initialStatesRef.current)
    )
      dispatch({ payload: initialStates })
  }, [initialStates])

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
  const [form, dispatch] = useReducer(reducer, initialState, () => initialState)
  const context = useContext(FormContext)

  /**
   * We override initialState if the prop has changed.
   * Useful for asynchronously fetched initialState.
   */
  const initialStateRef = useRef(initialState)
  useEffect(() => {
    if (
      JSON.stringify(initialState) !== JSON.stringify(initialStateRef.current)
    )
      dispatch({ payload: initialState })
  }, [initialState])

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

const getForms = () => ({ ...useContext(FormContext).forms })

export {
  FormProvider,
  getForms,
  useFormContext
}

