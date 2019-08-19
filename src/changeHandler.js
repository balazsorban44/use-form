import validate from './validate'
import convert from './utils/convert'

/**
 * Can take multiple values at once as well. In that case,
 * the first parameter must be an object that will be
 * merged with the form.
 */
export default function changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args }) {

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

      const validatorKeys = Object.keys(validators({}))
      if (process.env.NODE_ENV !== 'production' && args[1].some(v => !validatorKeys.includes(v))) {
        throw new Error(`Some of the validations (${args[1]}) are not present in the validators object.`)
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

}