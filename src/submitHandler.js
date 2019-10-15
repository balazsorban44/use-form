import validate from './validate'
import { errors as devErrors } from './handleDevErrors'

/**
 * Called when a form is submitted.
 * It does a validation on all the fields
 * before it is being sent.
 */
export default function submitHandler({ e, name, form, submit, setLoading, setErrors, onNotify, validators }) {
  e?.preventDefault?.()
  const errors = validate({ fields: form, validators, submitting: true })
  setErrors(e => ({ ...e, ...errors }))

  const _errors = Object.entries(errors).filter(([_, v]) => v).map(([k]) => k)
  if (_errors.length)
    onNotify?.('validationErrors', _errors)

  else {
    const submitParams = {
      fields: form,
      setLoading,
      notify: (...args) => {
        if (onNotify)
          if (process.env.NODE_ENV !== 'production' && !['submitSuccess', 'submitError'].includes(args[0]))
            throw new TypeError(devErrors.onNotifyWrongParam)
          else
            onNotify(...args)
        else if(process.env.NODE_ENV !== 'production')
          throw new Error(devErrors.onNotify)
      }
    }

    if (name) submitParams.name = name

    return submit(submitParams)
  }
}