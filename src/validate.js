export default function validate({
  fields,
  validators,
  validations = [],
  form = {}
}) {
  return ([...Object.keys(fields), ...validations])
    .reduce((acc, field) => {
      if (field in validators) {
        const error = !validators[field]({ ...form, ...fields })

        if (field in fields) acc[field] = error
        // if this is a custom validation, set error on the field that used it
        else Object.keys(fields).forEach(field => {acc[field] = error})

      } else throw new Error(`${field} has no validator defined in validators.`)

      return acc
    }, {})
}