export default function validate({
  fields,
  validators,
  validations,
  form = {},
  submitting
}) {
  return (validations || Object.keys(fields))
    .reduce((acc, field) => ({
      ...acc,
      [field]: !validators[field]({ ...form, ...fields }, submitting)
    }), {})
}