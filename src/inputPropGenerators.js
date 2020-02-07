
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
  (name, { value, generateProps, formName } = {}) => {
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
      props.checked = field.value === value
      props.id = value
      break
    case 'checkbox':
      props.checked = field.value
      break
    case 'select':
      delete props.type
      break
    case 'submit':
      props = {
        value: name,
        children: name,
        type: 'submit'
      }
      if (formName)
        props.onClick = e => handleSubmit(e, { formName })
      else
        props.onClick = handleSubmit
      break
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