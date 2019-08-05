
const inputTypes = [
  'text', 'radio', 'email', 'password', 'search', 'color', 'tel', 'url',
  'date', 'datetime-local', 'time', 'week', 'month',
  'number', 'range',
  'checkbox',
]

export default function inputPropGenerators(fields, onChange) {
  return inputTypes.reduce((acc, type) => {
    const inputProps = (name, value) => {
      const result = {
        name,
        id: name,
        value: fields[name],
        onChange,
        type
      }
      if (type === 'radio') {
        result.id = value
        result.value = value
        if (type === 'date') {
          result.value = new Date(value).format('yyyy-MM-dd')
        }
      } else if (type === 'checkbox') {
        result.checked =
        Array.isArray(fields[name]) ?
          fields[name].includes(value) :
          fields[name]
        result.value = value
      }
      return result
    }

    return { ...acc, [type]: inputProps }
  }, {})
}