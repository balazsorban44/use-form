import { useState } from 'react'
import { useFormContext } from './FormContext'

import inputPropGenerators from './inputPropGenerators'

import handleDevErrors from './handleDevErrors'
import changeHandler from './changeHandler'
import submitHandler from './submitHandler'
import concatFieldsAndErrors from './utils/concatFieldsAndErrors'

export default function useForm ({ name, initialState, validators, onSubmit, onNotify }) {

  const { form, dispatch, ...c } = useFormContext(name, initialState)

  validators = validators || c.validators
  onNotify = onNotify || c.onNotify
  onSubmit = onSubmit || c.onSubmit

  if (process.env.NODE_ENV !== 'production')
    handleDevErrors({ name, initialState, form, validators, onSubmit })


  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fields = concatFieldsAndErrors(form, errors)


  const handleChange = (...args) =>
    changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args })

  const handleSubmit = e =>
    submitHandler({ e, name, form, submit: onSubmit, setLoading, onNotify, setErrors, validators })

  const inputs = inputPropGenerators({ fields, handleChange, handleSubmit })

  return ({
    name,
    fields,

    handleChange,

    loading,
    handleSubmit,

    inputs
  })
}