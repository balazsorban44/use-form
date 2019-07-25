import { useContext, useCallback, useState } from 'react'
import validate from './validate'
import FormContext from './FormContext'


export default function useForm ({
  name,
  validators,
  submit,
  onFinished = null,
  onNotify = null,
  context = null,
  validations, // NOTE: Remove in next major bump.
  validatorObject // NOTE: Remove in next major bump.
}) {


  if (process.env.NODE_ENV !== 'production') {
    // NOTE: Remove in next major bump.
    if (validatorObject) {
      console.warn('validatorObject is being deprecated. Please use validators instead.')
      validators = validatorObject
    }

    // NOTE: Remove in next major bump.
    if (validations)
      console.warn([
        'validations is being deprecated. You do not have to define it anymore.',
        'When submitting, all the validator functions defined in validators will be run.',
      ].join(' '))

    if (Object.prototype.toString.call(validators) !== '[object Object]')
      throw new TypeError(`validators argument must be an object, but it was ${typeof validators}.`)
  }

  const { dispatch, forms } = useContext(context || FormContext)
  const [errors, setErrors] = useState({})
  const form = forms[name]

  const [loading, setLoading] = useState(false)


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

      if (process.env.NODE_ENV !== 'production' && !name)
          throw new Error(`Invalid name attribute on input. Should be a string but was ${name}.`)

        fields[name] = type === 'checkbox' ? checked : value

      } else if(Object.keys(Object.keys(args[0]).every(k => k in form))) fields = args[0]
      else throw new TypeError('Invalid fields object. Are all the keys present in the form?')

      if (
        args[1] &&
        Array.isArray(args[1]) &&
        args[1].every(v => v in validators)
      ) validations = args[1]

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
    e.preventDefault && e.preventDefault()

    if (!loading) {
      const errors = validate({ fields: form, validators })

      if (Object.values(errors).some(e => e)) {
        setErrors(e => ({ ...e, ...errors }))
        onNotify && onNotify('submitError')
      }
      else {
        submit({
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

  if (process.env.NODE_ENV !== 'production' && !form) {
    throw new Error([
      `The initial state for "${name}" was undefined.`,
      'You can define an initialState in the FormProvider',
      'like this: <FormProvider options={{initialState: {formName: /*initial values here*/}}}>...',
    ].join(' '))
  }

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