import React, { createContext, useReducer, useEffect, useRef } from 'react'

const FormContext = createContext()

function reducer(state, { type, payload }) {
  if (typeof type !== 'string')
    throw TypeError(`Type ${type} must be a string, it was: ${typeof type}`)

  if (type in state) return { ...state, [type]: { ...state[type], ...payload } }

  if (type === 'SET_DEFAULT') return { ...payload }
}

function FormProvider({ children, initialState }) {
  const [forms, dispatch] = useReducer(reducer, initialState)


  /**
   * We override initialState if the prop has changed.
   * Useful for asynchronously fetched initialStates.
   */
  const initialStateRef = useRef(initialState)
  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(initialStateRef.current)) {
      dispatch({ type: 'SET_DEFAULT', payload: initialState })
    }
  }, [initialState])

  return (
    <FormContext.Provider value={{ forms, dispatch }}>
      {children}
    </FormContext.Provider>
  )
}

export {
  FormContext as default,
  FormProvider
}