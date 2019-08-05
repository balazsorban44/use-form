import { useContext, useCallback, useState, useMemo } from 'react'
import FormContext from './FormContext'
import validate from './validate'
import isObject from './utils/isObject'
import inputPropGenerators from './inputPropGenerators'
import convert from './utils/convert'

import { version } from '../package.json'
if (process.env.NODE_ENV !== 'production' && version.includes('beta')) {
  console.warn([
    '⚠  CAUTION!  ⚠ ',
    `You are using another-use-form-hook@${version}.`,
    'This is highly experimental, and probably WILL crash and CONTAINS bugs 🐛',
    '⚠  CAUTION!  ⚠ ',
  ].join('\n'))
}


const handleDevErrors = (name, form, validators) => {
  if (typeof name !== 'string')
    throw new TypeError(`name must be a string, but it was ${typeof name}.`)

  if (!isObject(form)) {
    throw new Error([
      `The initial state for "${name}" is invalid.`,
      'You can define an initialState in the FormProvider like this:',
      '<FormProvider initialState={{formName: /*initial values here*/}}>...',
    ].join(' '))
  }

  if (!isObject(validators)) {
    throw new TypeError(`validators must be an object, but it was ${typeof validators}.`)
  } else {
    Object.keys(form).forEach(key => {
      if(
        typeof validators[key] !== 'function' ||
        typeof validators[key](form) !== 'boolean'
      ) {
        throw new TypeError([
          `The validator for ${key} in validators is invalid.`,
          'To validate a field, define a function that',
          'returns true if valid, and false if invalid.',
        ].join(' '))
      }
    })
  }
}

export default function useForm ({
  name,
  validators,
  submit,
  onFinished = null,
  onNotify = null
}) {

  // Setup
  const { dispatch, forms } = useContext(FormContext)
  const form = forms[name]
  const [errors, setErrors] = useState({})


  // Notify developer early on, if some of the required params are wrong.
  if (process.env.NODE_ENV !== 'production') {
    handleDevErrors(name, form, validators)
  }


  // Concat errors with field values
  const fields = [...Object.keys(form), ...Object.keys(errors)]
    .reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: key in form ? form[key] : undefined,
        error: key in errors ? errors[key] : false
      }
    }), {})


  /**
   * The change handler.
   * Can take multiple values at once as well. In that case,
   * the first parameter must be an object that will be
   * merged with the form.
   */
  const handleChange = useCallback((...args) => {
    let fields = {}
    let validations

    try {
      if ('target' in args[0]) {
        const { name, value, type, checked } = args[0].target

        if (process.env.NODE_ENV !== 'production' && !Object.keys(form).includes(name))
          throw new Error(`Invalid name attribute on input. "${name}" must be present in the form.`)

        fields[name] = convert(type, value, checked, form[name])

      } else {
        if(Object.keys(args[0]).every(k => k in form))
          fields = args[0]
        else if(process.env.NODE_ENV !== 'production')
          throw new TypeError('Invalid fields object. Are all the keys present in the form?')
      }
      if (Array.isArray(args[1])) {
        if (process.env.NODE_ENV !== 'production' && args[1].some(v => !(v in validators))) {
          throw new Error(`Some of the validations (${validations}) are not present in the validators object.`)
        }
        validations = args[1]
      }

      const errors = validate({
        form,
        validations,
        fields,
        validators
      })

      setErrors(e => ({ ...e, ...errors }))

      const validationErrors = Object.keys(errors).filter(field => errors[field])
      validationErrors.length && onNotify?.('validationErrors', validationErrors)

      dispatch({ type: name, payload: fields })
    } catch (error) {
      console.error(error)
    }

  }, [dispatch, form, name, onNotify, validators])

  const [loading, setLoading] = useState(false)

  /**
   * Run the validator on the given fields
   * @param {Object?} fields - defaults to the entire form
   */
  const validateFields = useCallback((fields = form) => validate({ fields, validators }), [form, validators])

  /**
   * Called when a form is submitted.
   * It does a validation on all the fields
   * before it is being sent.
   */
  const handleSubmit = useCallback(e => {
    e && e.preventDefault && e.preventDefault()

    const errors = validateFields()
    setErrors(e => ({ ...e, ...errors }))

    const _errors = Object.values(errors).filter(e => e)
    if (_errors.length) onNotify?.('submitError', _errors)

    else {
      const submitParams = {
        fields: form,
        setLoading
      }

      if (onNotify) {
        submitParams.notify = function notify(type, ...args) {
          if (
            process.env.NODE_ENV !== 'production' &&
            !['submitSuccess', 'submitError'].includes(type)
          ) throw new TypeError('notify inside handleSubmit must be either "submitSuccess" or "submitError"')
          else onNotify(type, ...args)
        }
      }

      if (onFinished) submitParams.finish = onfinished

      return submit(submitParams)
    }
  }, [validateFields, onNotify, form, onFinished, submit])


  const inputs = useMemo(() => inputPropGenerators(form, handleChange), [form, handleChange])


  return ({
    fields,

    handleChange,

    loading,
    validateFields,
    handleSubmit,

    inputs
  })
}