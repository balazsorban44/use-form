export default function validate({
  fields,
  validators,
  validations = [],
  form = {}
}) {
  return ([...Object.keys(fields), ...validations])
    .reduce((acc, field) => {
      const error = !validators[field]({ ...form, ...fields })

      if (field in fields) acc[field] = error

      // if this is a custom validation, set error on the field that used it
      else Object.keys(fields).forEach(field => {acc[field] = error})

      return acc
    }, {})
}