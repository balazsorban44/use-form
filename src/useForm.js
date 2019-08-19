import { useCallback, useState } from 'react'
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


  const handleChange = useCallback((...args) =>
    changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args })
  , [dispatch, form, name, onNotify, validators])


  const handleSubmit = useCallback(e =>
    submitHandler({ e, name, form, submit: onSubmit, setLoading, onNotify, setErrors, validators })
  , [name, form, onSubmit, onNotify, validators])

  const inputs = inputPropGenerators({ fields, handleChange, handleSubmit })

  return ({
    fields,

    handleChange,

    loading,
    handleSubmit,

    inputs
  })
}