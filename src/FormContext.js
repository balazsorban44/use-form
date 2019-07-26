import React, { createContext, useReducer, useEffect, useRef } from 'react'

const FormContext = createContext()

function reducer(state, { type, payload }) {
  return (type in state) ?
    { ...state, [type]: { ...state[type], ...payload } } :
    { ...state, ...payload }
}

function FormProvider({ children, initialState = {} }) {
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