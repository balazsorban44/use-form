import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { render as customRender, fireEvent } from '../test-utils'
import useForm from '../useForm'
import { errors } from '../handleDevErrors'
import validatorsMock from './utils/validators.mock'

it('invalid validator throws error', () => {

  const Component = ({ validators }) => {
    useForm({ name: 'form', validators, onSubmit: jest.fn() }).handleSubmit()
    return null
  }

  expect(() => customRender(
    <Component/>,
    { initialStates: { form: { input: '' } } }
  ))
    .toThrow(errors.validators(undefined))

  expect(() => customRender(
    <Component validators={() => ({ input: null })} />,
    { initialStates: { form: { input: '' } } }
  ))
    .toThrow(errors.invalidValidators(['input']))

})

it('invalid name throws error', () => {

  const Component = ({ name }) => {
    useForm({ name, validators: validatorsMock, onSubmit: () => null })
    return null
  }

  expect(() => customRender(
    <Component name="name"/>,
    { initialStates: { name: {} } } )
  )
    .not.toThrow()

  expect(() => customRender(<Component/>)).toThrow(errors.name())
  expect(() => customRender(<Component name={{}}/>)).toThrow(errors.name({}))
  expect(() => customRender(<Component name={() => null}/>)).toThrow(errors.name(() => null))

})

it('wrong field names in handleChange throws error', () => {

  const Component = ({ handleChangeParams }) => {
    useForm({
      initialState: {},
      validators: validatorsMock,
      onSubmit: () => null
    }).handleChange(handleChangeParams)
    return null
  }

  expect(() => render (<Component handleChangeParams={{ target: {} }}/>))
    .toThrow(new Error(errors.missingFields([undefined])))


  expect(() => render (<Component handleChangeParams={{ field: '' }}/>))
    .toThrow(new Error(errors.missingFields(['field'])))

  process.env.NODE_ENV = 'production'
  expect(() => render (<Component handleChangeParams={{ field: '' }}/>))
    .not.toThrow(new Error(errors.missingFields(['field'])))
  process.env.NODE_ENV = 'test'
})


// TODO: Simplify
it('handleChange validates', () => {

  const onNotify = jest.fn()

  const Component = () => {
    const form = useForm({
      initialState: {
        input1: 0,
        input2: 1
      },
      validators: ({ input1, input2 }) => ({
        input1: parseInt(input1, 10) + parseInt(input2,10) === 2,
        input2: parseInt(input1, 10) + parseInt(input2, 10) === 2,
        customValidation: parseInt(input1, 10) + parseInt(input2, 10) === 2
      }),
      onNotify,
      onSubmit: () => null
    })

    const customHandleChange = (validations = []) => ({ target: { name, value } }) => {
      form.handleChange({ [name]: parseInt(value, 10) }, validations)
    }

    return (
      <form onSubmit={form.handleSubmit}>
        <label htmlFor="input1">
          {form.fields.input1.error ? 'input 1 and input 2 must equal 3' : 'input 1'}
        </label>
        <input
          name="input1"
          id="input1"
          value={form.fields.input1.value}
          onChange={customHandleChange(['input1', 'customValidation'])}
        />
        <label htmlFor="input2">{form.fields.input2.error ? 'input 2 error' : 'input 2'}</label>
        <input
          name="input2"
          id="input2"
          value={form.fields.input2.value}
          onChange={form.handleChange}
        />
      </form>
    )
  }

  const { getByLabelText, queryByLabelText } = render(<Component/>)

  const input1 = getByLabelText('input 1')

  fireEvent.change(input1, { target: { name: 'input1', value: '2' } })
  expect(getByLabelText('input 1 and input 2 must equal 3')).toBeInTheDocument()

  const input2 = getByLabelText('input 2')

  fireEvent.change(input2, { target: { name: 'input2', value: '0' } })

  expect(queryByLabelText('input 2 error')).toBeNull()

  fireEvent.change(input2, { target: { name: 'input2', value: '1' } })

  expect(queryByLabelText('input 2 error')).toBeInTheDocument()

  // Notifies about errors.
  expect(onNotify).toBeCalledTimes(2)
  expect(onNotify).toBeCalledWith('validationErrors', ['input1', 'customValidation'])
  expect(onNotify).toBeCalledWith('validationErrors', ['input2'])


  jest.resetAllMocks()
})


describe('handleSubmit validates', () => {

  const form = {
    initialState: { input1: 'valid', input2: 'validToo' },
    onSubmit: jest.fn(),
    onNotify: jest.fn()
  }

  const Component = ({ validators = validatorsMock }) => {
    const { inputs } = useForm({ ...form, validators })
    return (
      <form>
        <input {...inputs.text('input1')}/>
        <input {...inputs.text('input2')}/>
        <button {...inputs.submit('submit')}/>
      </form>
    )
  }

  beforeEach(jest.resetAllMocks)

  it('validation should not fail', () => {
    render(<Component />)
    fireEvent.click(screen.getByText(/submit/i))
    expect(form.onNotify).not.toBeCalled()
    expect(form.onSubmit).toBeCalledWith({
      fields: form.initialState,
      setLoading: expect.any(Function),
      notify: expect.any(Function)
    })

  })

  it('validation should fail', () => {
    const input2ErrorValidatorsMock = (_, submitting) => ({
      input1: true,
      input2: !submitting
    })
    render(<Component validators={input2ErrorValidatorsMock}/>)
    fireEvent.click(screen.getByText(/submit/i))
    expect(form.onSubmit).not.toBeCalled()
    expect(form.onNotify).toBeCalledWith('validationErrors', ['input2'])
  })

})


it('checkboxes\' checked prop used as value when form event is passed to handleChange', () => {
  const Component = () => {
    const form = useForm({
      initialState:  { input: false },
      validators: validatorsMock,
      onSubmit: () => null
    })

    return (
      <input
        name="input"
        type="checkbox"
        onChange={form.handleChange}
        value={form.fields.input.value}
        checked={form.fields.input.value}
      />
    )
  }

  const { getByDisplayValue } = render(<Component/>)

  const input = getByDisplayValue('false')

  fireEvent.click(input, {
    target: {
      name: 'input',
      type: 'checkbox',
      checked: false
    }
  })

  expect(getByDisplayValue('true')).toBeInTheDocument()

})


it('if onNotify is not defined, throw error ', () => {
  const App = ({ useFormParams, notifyParam }) => {
    const form = useForm({
      initialState: { input: 'initial value' },
      onSubmit: ({ notify }) => {notify(notifyParam)},
      validators: validatorsMock,
      ...useFormParams
    })

    useEffect(() => {
      form.handleSubmit()
    }, [])
    return null
  }

  expect(() => render(<App/>)).toThrowError(new Error(errors.onNotify))
  process.env.NODE_ENV = 'production'
  expect(() => render(<App/>)).not.toThrowError(new Error(errors.onNotify))
  process.env.NODE_ENV = 'test'

  expect(() => render(<App notifyParam="INVALID" useFormParams={{ onNotify: jest.fn() }}/>))
    .toThrowError(new Error(errors.onNotifyWrongParam))

  const onNotify = jest.fn()
  const notifyParam = 'submitSuccess'
  render(<App notifyParam={notifyParam} useFormParams={{ onNotify }}/>)
  expect(onNotify).toBeCalledWith(notifyParam)
})


it('should propagate name from event target', () => {
  const onSubmit = jest.fn()
  const initialState = { input: '' }
  const formName = 'formName'

  const App = ({ name }) => {
    const form = useForm({ name, initialState, validators: validatorsMock, onSubmit })
    return (
      <form>
        <label htmlFor="input">Input</label>
        <input {...form.inputs.text('input')}/>
        <button {...form.inputs.submit('Submit', { formName })}/>
      </form>
    )
  }

  const { getByText } = render(<App/>)
  fireEvent.click(getByText(/submit/i))
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ name: formName }))

})


it('should run custom validations on submit', () => {
  const onSubmit = jest.fn()
  const onNotify = jest.fn()
  const initialState = { input: '' }

  const validators = (fields, submitting) => ({
    custom: !submitting,
    input: typeof fields.input === 'string'
  })

  const App = () => {
    const form = useForm({
      validators,
      initialState,
      onNotify,
      onSubmit
    })
    return (
      <form>
        <label htmlFor="input">input</label>
        <input
          {...form.inputs.text('input')}
          onChange={e =>
            form.handleChange({ input: e.target.value }, ['input', 'custom'])
          }
        />
        <button {...form.inputs.submit('submit')}>submit</button>
      </form>
    )
  }

  render(<App/>)
  fireEvent.change(screen.getByLabelText(/input/i), { target: { name: 'name', value: 'hello' } })
  expect(onNotify).not.toBeCalledWith('validationErrors', ['custom'])
  fireEvent.click(screen.getByText(/submit/i))
  expect(onNotify).toBeCalledWith('validationErrors', ['custom'])
})