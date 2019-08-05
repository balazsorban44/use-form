export default function convert(type, value, checked, prevValue) {
  switch (type) {
  case 'range':
  case 'number':
    return parseInt(value, 10)
  case 'date':
  case 'month':
  case 'time':
  case 'week':
  case 'datetime-local':
    // REVIEW: Do somehting?
  case 'checkbox': {
    if (Array.isArray(prevValue)) {
      const newValue = prevValue.filter(v => v !== value)
      if (checked) newValue.push(value)
      return newValue
    } else return checked
  }
  // Rest of the types' values are strings
  default:
    return value
  }
}