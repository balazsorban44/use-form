export default function convert(type, value, checked) {
  switch (type) {
  case 'range':
  case 'number':
    return parseInt(value, 10)
  case 'checkbox':
    return checked
  case 'date':
  case 'month':
  case 'time':
  case 'week':
  case 'datetime-local':
    return value
  default:
    return value
  }
}