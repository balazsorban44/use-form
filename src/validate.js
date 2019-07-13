/** */
export default function validate({ form={}, fields, validatorObject, validations=[], handleError=null }) {
  const errors = {}
  const validateOn = ([...Object.keys(fields), ...validations])

  validateOn.forEach(key => {
    if (key in validatorObject) {
      const error = !validatorObject[key]({...form, ...fields})

      if (key in fields) errors[key] = error
      
      // if this is a custom validation, set error on the field that used it
      else Object.keys(fields).forEach(field => {errors[field] = error})

    } else {
      throw new Error(`${key} has no validator in validatorObject`)
    }
  })

  const hasErrors = Object.values(errors).some(e => e)

  handleError && handleError(errors, hasErrors)

  return hasErrors
}