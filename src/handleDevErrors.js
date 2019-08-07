import isObject from './utils/isObject'
import { version } from '../package.json'

export default function handleDevErrors ({ name, form, validators, submitCallback }) {

  if (version.includes('alpha')) {
    console.warn([
      '⚠  CAUTION!  ⚠ ',
      `You are using another-use-form-hook@${version}.`,
      'This is highly experimental. It WILL crash and CONTAINS bugs 🐛',
      'Only for testing purposes.',
    ].join('\n'))
  }

  if (typeof name !== 'string')
    throw new TypeError(`name must be a string, but it was ${typeof name}.`)

  if (!isObject(validators)) {
    throw new TypeError(`validators must be an object, but it was ${typeof validators}.`)
  } else {
    Object.keys(form).forEach(key => {
      if(
        typeof validators[key] !== 'function' ||
        typeof validators[key](form) !== 'boolean'
      ) {
        throw new TypeError([
          `The validator for ${key} in validators is invalid.`,
          'To validate a field, define a function that',
          'returns true if valid, and false if invalid.',
        ].join(' '))
      }
    })
  }

  if (typeof submit !== 'function')
    throw new TypeError(`The submit parameter of useForm must be a function, but it was ${typeof submit}.`)
}