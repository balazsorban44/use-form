import isObject from './utils/isObject'
import { version } from '../package.json'

export const warnings = {
  alpha: [
    '⚠  CAUTION!  ⚠ ',
    `You are using another-use-form-hook@${version}.`,
    'This is highly experimental. It WILL crash and CONTAINS bugs 🐛',
    'Only for testing purposes.',
  ].join('\n')
}

export const errors = {
  name: name => `name must be a string, but it was ${typeof name}.`,

  initialState: name => [
    `The initial state for "${name}" is invalid.`,
    'docs: TODO: add link',
  ].join('\n'),

  submit: submit => [
    `submit must be a function, but it was ${typeof submit}.`,
    'docs: TODO: add link',
  ].join('\n'),

  validators: validators => [
    `validators must be an object, but it was ${typeof validators}.`,
    'docs: TODO: add link',
  ].join('\n'),

  validator: keys => [
    `The validator(s) for ${keys} in validators are invalid.`,
    'docs: TODO: add link',
  ].join('\n'),
  outsideProvider: 'useForm cannot be used outside a FormProvider'
}


export default function handleDevErrors ({ name, form, validators, submit }) {

  if (version.includes('alpha'))
    console.warn(warnings.alpha)

  if (typeof name !== 'string')
    throw new TypeError(errors.name(name))

  if (!form)
    throw new Error(errors.initialState(name))

  if (!isObject(validators)) {
    throw new TypeError(errors.validators(validators))

  } else {
    const invalidValidators = Object.keys(form).filter(key =>
      typeof validators[key] !== 'function' ||
      typeof validators[key](form) !== 'boolean'
    )
    if (invalidValidators.length)
      throw new TypeError(errors.validator(invalidValidators))
  }

  if (typeof submit !== 'function')
    throw new TypeError(errors.submit(submit))
}