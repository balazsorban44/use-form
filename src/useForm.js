import { useContext, useCallback, useState, useMemo } from 'react'
import { useFormContext } from './FormContext'
import validate from './validate'

import inputPropGenerators from './inputPropGenerators'
import convert from './utils/convert'

import handleDevErrors from './handleDevErrors'
import changeHandler from './changeHandler'
import submitHandler from './utils/submitHandler'
import concatFieldsAndErrors from './utils/concatFieldsAndErrors'


export default function useForm ({
  name,
  submit = null,
  validators = undefined,
  onFinished = null,
  onNotify = null
}) {


  const {
    dispatch,
    forms,
    validators: _validators,
    onNotify: _onNotify,
    submit: _submit
  } = useContext(context || FormContext)

  const form = forms[name]

  validators = validators || (_validators[name] ? { ..._validators[name] } : undefined)
  onNotify = onNotify || _onNotify

  const [errors, setErrors] = useState({})
  submit = submit || _submit

  if (process.env.NODE_ENV !== 'production')
    handleDevErrors({ name, form, validators, submit })

  const fields = concatFieldsAndErrors(form, errors)


  const handleChange = useCallback((...args) => {
    changeHandler(dispatch, form, name, onNotify, validators, ...args)
  }, [dispatch, form, name, onNotify, validators])

  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(e => {
    submitHandler({ e, name, form, submit, setLoading, onNotify, onFinished })
  }, [name, form, submit, onNotify, onFinished])


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