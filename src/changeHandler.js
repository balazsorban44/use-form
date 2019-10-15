import validate from './validate'
import convert from './utils/convert'
import { errors as devErrors } from './handleDevErrors'
/**
 * Can take multiple values at once as well. In that case,
 * the first parameter must be an object that will be
 * merged with the form.
 */
export default function changeHandler({ dispatch, setErrors, form, name, onNotify, validators, args }) {

  let fields = {}

  let validations

  if ('target' in args[0]) {
    const { name, value, type, checked } = args[0].target

    if (process.env.NODE_ENV !== 'production' && !Object.keys(form).includes(name))
      throw new Error(devErrors.missingFields([name]))

    fields[name] = convert(type, value, checked)

  } else {
    if (process.env.NODE_ENV !== 'production') {
      const nonExistentFields = Object.keys(args[0]).filter(k => !(k in form))
      if(nonExistentFields.length) throw new Error(devErrors.missingFields(nonExistentFields))
    }
    fields = args[0]
  }
  if (Array.isArray(args[1])) {
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


}