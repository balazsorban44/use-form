export default function validate({
  fields,
  validators,
  validations,
  form = {},
  submitting = false
}) {
  return (validations || Object.keys(fields))
    .reduce((acc, field) => ({
      ...acc,
      [field]: !validators({ ...form, ...fields }, submitting)[field]
    }), {})
}