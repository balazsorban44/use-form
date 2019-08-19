import { version } from '../package.json'

export const warnings = {
  alpha: [
    '⚠  CAUTION! ⚠ ',
    `another-use-form-hook@${version} is an experimental version`,
    'and it may contain bugs 🐛',
  ].join('\n')
}

export const errors = {
  name: name => [
    'if you use a FormProvider and no initialState is given in useForm',
    `name must be a string, but it was ${typeof name}.`,
  ].join('\n'),

  initialState: name => [
    `The initial state for "${name}" is invalid.`,
    'docs: TODO: add link',
  ].join('\n'),
  missingFields: fields => `The following field(s) are missing from the form: ${fields}`,
  onSubmit: onSubmit => [
    `onSubmit must be a function, but it was ${typeof onSubmit}.`,
    'docs: TODO: add link',
  ].join('\n'),

  validators: validators => [
    `validators must be a function, but it was ${typeof validators}.`,
    'docs: TODO: add link',
  ].join('\n'),

  validator: keys => [
    `The validator(s) for ${keys} in validators are invalid.`,
    'docs: TODO: add link',
  ].join('\n'),
  outsideProvider: 'useForm cannot be used outside a FormProvider'
}

export default function handleDevErrors ({ name, initialState, form, validators, onSubmit }) {

  if (version.includes('alpha') && !process.env.NO_USE_FORM_ALPHA_WARNING) {
    console.warn(warnings.alpha)
  }

  if (typeof name !== 'string' && !initialState)
    throw new TypeError(errors.name(name))

  if (!form)
    throw new Error(errors.initialState(name))

  if (typeof validators !== 'function') {
    throw new TypeError(errors.validators(validators))

  } else {
    const invalidValidators = Object.keys(form).filter(key =>
      typeof validators(form, false)[key] !== 'boolean'
    )
    if (invalidValidators.length)
      throw new TypeError(errors.validator(invalidValidators))
  }

  if (typeof onSubmit !== 'function')
    throw new TypeError(errors.onSubmit(onSubmit))
}