/** */
export default function validate({ fields, validatorObject, validations=[], handleError=null }) {
  const errors = {}
  const validateOn = ([...Object.keys(fields), ...validations])

  validateOn.forEach(key => {
    if (key in validatorObject) {
      const error = !validatorObject[key](fields)
      errors[key] = error
    } else {
      throw Error(`${key} has no validator in validatorObject`)
    }
  })

  const hasErrors = Object.values(errors).some(e => e)

  handleError && handleError(errors, hasErrors)

  return hasErrors
}