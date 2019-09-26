import React from 'react'
import { render } from '@testing-library/react'
import { render as customRender, fireEvent, cleanup } from '../test-utils'
import useForm from '../useForm'
import { errors } from '../handleDevErrors'
import validatorsMock from './utils/validators.mock'

it('invalid validator throws error', () => {

  const Component = ({ validators }) => {
    useForm({ name: 'form', validators })
    return null
  }

  expect(() => customRender(
    <Component/>,
    { initialStates: { form: { input: '' } } }
  ))
    .toThrow(errors.validators())

  expect(() => customRender(
    <Component validators={() => ({ input: null })} />,
    { initialStates: { form: { input: '' } } }
  ))
    .toThrow(errors.validator('input'))

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


// TODO: Simplify
it('handleSubmit validates', () => {

  const form = {
    initialState: { input1: 'valid', input2: 'validToo' },
    validators: validatorsMock,
    onSubmit: jest.fn(),
    onNotify: jest.fn()
  }
  const input2ErrorValidatorsMock = () => new Proxy({}, { get: (...a) => a[1] !== 'input2' })

  const Component = ({ input2ShouldFail }) => {
    form.validators =
      input2ShouldFail ?
        input2ErrorValidatorsMock :
        validatorsMock

    const f = useForm(form)
    return (
      <form>
        <input {...f.inputs.text('input1')}/>
        <input {...f.inputs.text('input2')}/>
        <button {...f.inputs.submit()} >Submit</button>
      </form>
    )
  }

  fireEvent.click(render(<Component/>).getByText(/Submit/))

  expect(form.onSubmit).toBeCalledWith({
    fields: form.initialState,
    setLoading: expect.any(Function),
    notify: expect.any(Function)
  })

  jest.resetAllMocks()

  cleanup()

  fireEvent.click(render(<Component input2ShouldFail/>).getByText(/Submit/))

  expect(form.onNotify).toBeCalledWith('validationErrors', ['input2'])
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