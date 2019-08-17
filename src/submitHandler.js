import validate from './validate'

/**
 * Called when a form is submitted.
 * It does a validation on all the fields
 * before it is being sent.
 */
export default function submitHandler({ e, name, form, submit, setLoading, setErrors, onNotify, validators }) {
  e?.preventDefault?.()

  const errors = validate({ fields: form, validators })
  setErrors(e => ({ ...e, ...errors }))

  const _errors = Object.entries(errors).filter(([_, v]) => v).map(([k]) => k)
  if (_errors.length)
    onNotify?.('submitError', _errors)

  else {
    const submitParams = {
      name,
      fields: form,
      setLoading,
      notify: (...args) => {
        if (onNotify)
          if (process.env.NODE_ENV !== 'production' && !['submitSuccess', 'submitError'].includes(type))
            throw new TypeError('notify parameters inside handleSubmit must be either "submitSuccess" or "submitError"')
          else
            onNotify(...args)
        else if(process.env.NODE_ENV !== 'production')
          throw new Error('Please define an onNotify function as one of the parameters of useForm.')
      }
    }

    return submit(submitParams)
  }
}