import React, { createContext, useReducer } from "react"

const FormContext = createContext()

function reducer(state, {type, payload}) {
  if (typeof type !== "string") throw TypeError(`Type ${type} must be a string, it was: ${typeof type}`)

  if (type === "INITIAL_STATE") return payload

  if (type in state) return {...state, [type]: {...state[type], ...payload }}

  else return {...state, [type]: payload}
}


function FormProvider({children, initialState={}}) {
  const [forms, dispatch] = useReducer(reducer, initialState)
  return (
    <FormContext.Provider value={{forms, dispatch}}>
      {children}
    </FormContext.Provider>
  )
}

export {
  FormContext as default,
  FormProvider
}