
const inputTypes = [
  'text', 'radio', 'email', 'password', 'search', 'color', 'tel', 'url', 'submit',

  'date', 'time', 'week', 'month',
  'datetimeLocal', // NOTE: This is datetime-local

  'number', 'range',

  'checkbox',

  // Custom types
  'select',
]


const inputPropsGenerator = ({ type, fields, handleChange, handleSubmit }) =>
  (name, { value, generateProps } = {}) => {
    const field = fields[name]

    let props = {
      name,
      id: name,
      value: value || field?.value,
      onChange: handleChange,
      type
    }


    // Override props for specific types

    switch (type) {
    case 'datetimeLocal':
      props.type = 'datetime-local'
      break
    case 'radio':
      props.id = value
      break
    case 'checkbox':
      props.checked =
        Array.isArray(field.value) ?
          field.value.includes(value) :
          field.value
      break
    case 'select':
      delete props.value
      delete props.type
      break
    case 'submit':
      props = {
        value: name,
        children: name,
        type: 'submit',
        onClick: handleSubmit
      }
    default:
      break
    }

    return {
      ...props,
      ...generateProps?.({
        name,
        value: field.value,
        error: field.error
      })
    }
  }

const inputPropGenerators = args => inputTypes.reduce((acc, type) => ({
  ...acc,
  [type]: inputPropsGenerator({ type, ...args })
}), {})

export default inputPropGenerators