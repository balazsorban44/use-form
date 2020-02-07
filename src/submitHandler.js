import validate from './validate'
import { errors as devErrors } from './handleDevErrors'

/**
 * Called when a form is submitted.
 * It does a validation on all the fields
 * before it is being sent.
 */
export default function submitHandler({
  e, options, name, form, submit, setLoading, setErrors, onNotify, validators, customValidations
}) {
  e?.preventDefault?.()
  name = options?.formName || name

  const validations = [...Object.keys(form), ...customValidations]
  const errors = validate({ fields: form, validators, submitting: true, validations })
  setErrors(e => ({ ...e, ...errors }))

  const _errors = Object.entries(errors).reduce((a, [k, v]) => [...a, ...(v ? [k] : [])], [])
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