export default function validate({ fields, validators, validations, form = {}, submitting = false }) {
  const validationReducer = (acc, field) => {
    acc[field] = !validators({ ...form, ...fields }, submitting)[field]
    return acc
  }
  return validations.reduce(validationReducer, {})
}