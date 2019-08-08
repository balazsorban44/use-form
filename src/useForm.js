import { useContext, useCallback, useState, useMemo } from 'react'
import { useFormContext } from './FormContext'
import validate from './validate'

import inputPropGenerators from './inputPropGenerators'
import convert from './utils/convert'

import handleDevErrors from './handleDevErrors'
import changeHandler from './changeHandler'
import submitHandler from './submitHandler'
import concatFieldsAndErrors from './utils/concatFieldsAndErrors'


export default function useForm ({
  name,
  validators = undefined,
  submit = undefined,
  onNotify = undefined
}) {


  const {
    dispatch,
    form,
    validators: _validators,
    onNotify: _onNotify,
    submit: _submit
  } = useFormContext(name)

  validators = validators || _validators
  onNotify = onNotify || _onNotify
  submit = submit || _submit

  const [errors, setErrors] = useState({})


  if (process.env.NODE_ENV !== 'production')
    handleDevErrors({ name, form, validators, submit })

  const fields = concatFieldsAndErrors(form, errors)


  const handleChange = useCallback((...args) => {
    changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args })
  }, [dispatch, form, name, onNotify, validators])

  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(e => {
    submitHandler({ e, name, form, submit, setLoading, onNotify, setErrors, validators })
  }, [name, form, submit, onNotify, validators])


  const validateFields = useCallback(
    (fields, validations) =>
      validate({ fields, validators, validations }), [validators]
  )

  const inputs = useMemo(() => inputPropGenerators(form, handleChange), [form, handleChange])


  return ({
    fields,

    handleChange,

    loading,
    handleSubmit,

    validateFields,
    inputs
  })
}