import { useContext, useCallback, useState } from 'react'
import validate from './validate'
import FormContext from './FormContext'


/** */
export default function useForm ({
  name,
  submit,
  onFinished,
  onNotify,
  validations=[],
  validatorObject={},
  context=null
}) {

  const { dispatch, forms } = useContext(context || FormContext)
  const [errors, setErrors] = useState({})
  const form = forms[name]

  const [loading, setLoading] = useState(false)


  /**
   * Respond to input changes, like text fields, buttons etc.
   * Handles multiple field changes at once,
   * and also validates them.
   */
  const handleChange = useCallback((fields, validations=[]) => {
    validate({
      validations,
      fields,
      validatorObject,
      handleError: errors => {
        Object.entries(errors).forEach(([key, error]) => {
          error && onNotify('validationError', key)
        })
        setErrors(e => ({ ...e, ...errors }))
      }
    })
    dispatch({ type: name, payload: fields })
  }, [dispatch, name, onNotify, validatorObject])

  /**
   * Called when a form is submitted.
   * It does a validation on all the fields
   * before it is being sent.
   */
  const handleSubmit = useCallback(e => {
    if (!loading) {
      e.preventDefault && e.preventDefault()
      const hasErrors = validate({
        validations,
        fields: form,
        validatorObject,
        handleError: (errors, hasErrors) => {
          hasErrors && onNotify('submitError')
          setErrors(e => ({ ...e, ...errors }))
        }
      })
      if (!hasErrors) {
        submit({
          fields: form,
          setLoading,
          finish: () => {
            onNotify('submitSuccess')
            onFinished && onFinished()
          }
        })
      }
    }
  }, [
    // REVIEW: Find a better way to optimize here.
    validations,
    form, loading, onNotify, validatorObject,
    submit, onFinished,
  ])

  if (process.env.NODE_ENV !== 'production' && !form) {
    throw Error([
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