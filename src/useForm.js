import { useState } from 'react'
import { useFormContext } from './FormContext'

import inputPropGenerators from './inputPropGenerators'

import handleDevErrors from './handleDevErrors'
import changeHandler from './changeHandler'
import submitHandler from './submitHandler'
import concatFieldsAndErrors from './utils/concatFieldsAndErrors'

export default function useForm ({ name, initialState, validators, onSubmit, onNotify }) {

  const { form, dispatch, ...context } = useFormContext(name, initialState)

  validators = validators || context.validators
  onNotify = onNotify || context.onNotify
  onSubmit = onSubmit || context.onSubmit

  if (process.env.NODE_ENV !== 'production')
    handleDevErrors({ name, initialState, form, validators, onSubmit })


  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fields = concatFieldsAndErrors(form, errors)
  const hasErrors = Object.values(errors).some(e => e)


  const handleChange = (...args) =>
    changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args })

  const handleSubmit = (e, options) =>
    submitHandler({ e, options, name, form, submit: onSubmit, setLoading, onNotify, setErrors, validators })

  const inputs = inputPropGenerators({ fields, handleChange, handleSubmit })

  return ({
    name,
    fields,
    hasErrors,

    handleChange,

    loading,
    handleSubmit,

    inputs,

    validators
  })
}