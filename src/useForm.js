import { useContext, useCallback, useState } from 'react'
import validate from './validate'
import FormContext from './FormContext'


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
  const handleChange = useCallback((...args) => {
    let fields={},
        validations=[]
    
    if ("target" in args[0]) {
      const {name, value} = args[0].target
      if (!name)
        throw new Error(`Invalid name attribute on input. Should be a string but was ${name}.`)
      fields[name] = value
    } else {
      fields = args[0]
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

  }, [dispatch, form, name, onNotify, validators])

  /**
   * Called when a form is submitted.
   * It does a validation on all the fields
   * before it is being sent.
   */
  const handleSubmit = useCallback(e => {
    e.preventDefault && e.preventDefault()

    if (!loading) {
      const errors = validate({ form, validators })

      if (Object.values(errors).some(e => e)) {
          setErrors(e => ({ ...e, ...errors }))
        onNotify && onNotify('submitError')
        }
      else {
        submit({
          fields: form,
          setLoading,
          finish: () => {
            onNotify && onNotify('submitSuccess')
            onFinished && onFinished()
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