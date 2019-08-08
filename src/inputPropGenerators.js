
const inputTypes = [
  'text', 'radio', 'email', 'password', 'search', 'color', 'tel', 'url',

  'date', 'time', 'week', 'month',
  'datetimeLocal', // NOTE: This is datetime-local

  'number', 'range',

  'checkbox',
]

export default function inputPropGenerators(fields, onChange) {

  return inputTypes.reduce((acc, type) => {
    const inputProps = (name, value) => {
      const result = {
        name,
        id: name,
        value: value || fields[name],
        onChange,
        type
      }

      switch (type) {
      case 'datetimeLocal':
        result.type = 'datetime-local'
        break
      case 'radio':
        result.id = value
        break
      case 'checkbox':
        result.checked =
          Array.isArray(fields[name]) ?
            fields[name].includes(value) :
            fields[name]
        break
      default:
        break
      }

      return result
    }

    return { ...acc, [type]: inputProps }
  }, {})
}