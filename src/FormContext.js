import React, { createContext, useReducer, useContext, useMemo } from 'react'
import { errors } from './handleDevErrors'
import reducer from './reducer'
import useDeepCompareEffect from 'use-deep-compare-effect'

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
  useDeepCompareEffect(() => {
    dispatch({ payload: initialStates })
  }, [initialStates, dispatch])

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
  useDeepCompareEffect(() => {
    if (name) {
      context.dispatch({ payload: initialState })
    } else {
      dispatch({ payload: initialState })
    }
  }, [name, initialState, dispatch])

  if (!name) return { form, dispatch }

  if (process.env.NODE_ENV !== 'production' && !context)
    throw new Error(errors.outsideProvider(name))

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

