/** Concat field values with errors */
export default function concatFieldsAndErrors(fields, errors) {
  return [...Object.keys(fields), ...Object.keys(errors)]
    .reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: key in fields ? fields[key] : undefined,
        error: key in errors ? errors[key] : false
      }
    }), {})
}