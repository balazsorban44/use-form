import { useContext, useCallback, useState, useEffect } from 'react'
import validate from './validate'
import FormContext from './FormContext'
import isObject from './utils/isObject'

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



  // Notify developer early on, if some of the required params are wrong.
  if (process.env.NODE_ENV !== 'production') {
    handleDevErrors(name, forms, validators)
  }


  /**
   * Respond to input changes, like text fields, buttons etc.
   * Handles multiple field changes at once,
   * and also validates them.
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

      if (onNotify) {
        Object.keys(errors)
          .filter(field => errors[field])
          .forEach(field => {onNotify('validationError', field)})
      }

      dispatch({ type: name, payload: fields })
    } catch (error) {
      console.error(error)
    }

  }, [dispatch, form, name, onNotify, validators])

  /**
   * Called when a form is submitted.
   * It does a validation on all the fields
   * before it is being sent.
   */
  const handleSubmit = useCallback(e => {
    e && e.preventDefault && e.preventDefault()

    if (!loading) {
      const errors = validate({ fields: form, validators })

      if (Object.values(errors).some(e => e)) {
        setErrors(e => ({ ...e, ...errors }))
        onNotify && onNotify('submitError')
      }
      else {
        return submit({
          fields: form,
          setLoading,
          finish: (...args) => {
            onNotify && onNotify('submitSuccess')
            onFinished && onFinished(args)
          }
        })
      }
    }
  }, [
    // REVIEW: Find a better way to optimize here.
    form, loading, onNotify, validators, submit, onFinished,
  ])

  return ({
    // Concat errors with field values
    fields: Object.entries(form).reduce((acc, [key, value]) => {
      const field = { value }
      if (key in errors) {
        field.error = errors[key]
        if (errors[key]) acc.metadata = { hasErrors: true }
      }
      acc[key] = field
      return acc
    }, { metadata: { hasErrors: false } }),
    handleChange,
    handleSubmit,
    loading
  })
}