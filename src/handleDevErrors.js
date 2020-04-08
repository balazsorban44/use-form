import { version } from '../package.json'

export const warnings = {
  alpha: [
    '⚠  CAUTION! ⚠ ',
    `another-use-form-hook@${version} is an experimental version`,
    'and it may contain bugs 🐛',
  ].join('\n'),
  generatePropsToExtendProps: [
    'In a future version of the package,',
    'generateProps will be renamed to extendProps',
    'in favor of name consistency with useForms().extendProps.',
    'Note that extendProps specified here will override useForms().extendProps',
  ].join('\n')
}

export const errors = {
  name: name => [
    'if you use a FormProvider and no initialState is given in useForm',
    `name must be a string, but it was ${typeof name}.`,
  ].join('\n'),

  initialState: name => [
    `The initial state for "${name}" is invalid.`,
    'docs: https://github.com/balazsorban44/use-form/wiki#initialStates',
  ].join('\n'),
  missingFields: fields => `The following field(s) are missing from the form: ${fields}`,
  onNotify: 'If you use notify, you must define onNotify as a parameter in useForm.',
  onNotifyWrongParam: 'notify type must be either "submitSuccess" or "submitError"',
  onSubmit: onSubmit => [
    `onSubmit must be a function, but it was ${typeof onSubmit}.`,
    'docs: https://github.com/balazsorban44/use-form/wiki#use-form-onSubmit',
  ].join('\n'),
  validators: validators => [
    `validators must be a function, but it was ${typeof validators}.`,
    'docs: https://github.com/balazsorban44/use-form/wiki#use-form-validators',
  ].join('\n'),
  invalidValidators: (keys) => [
    `The following validator(s) were invalid: ${keys}`,
    'docs: https://github.com/balazsorban44/use-form/wiki#use-form-validators',
  ].join('\n'),
  outsideProvider: name => `useForm with name cannot be used outside a FormProvider (name was ${name})`
}

export default function handleDevErrors ({ name, initialState, form, validators, onSubmit }) {

  // if (version.includes('alpha') && !process.env.NO_USE_FORM_ALPHA_WARNING) {
  //   console.warn(warnings.alpha)
  // }

  if (typeof name !== 'string' && !initialState)
    throw new TypeError(errors.name(name))

  if (!form)
    throw new Error(errors.initialState(name))

  if (typeof validators !== 'function')
    throw new TypeError(errors.validators(validators))

  if (typeof onSubmit !== 'function')
    throw new TypeError(errors.onSubmit(onSubmit))
}