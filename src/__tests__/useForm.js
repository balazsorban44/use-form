import React from 'react'

import { render as originalRender, fireEvent, wait } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import { FormProvider } from '../FormContext'
import useForm from '../useForm'

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
  console.warn.mockRestore()
})

const render = (ui, { providerProps, ...options } = {}) => originalRender(ui, {
  wrapper: ({ children }) =>
    <FormProvider {...providerProps}>
      {children}
    </FormProvider>
  , ...options
})

describe('deprecation warnings for changed parameters', () => {
  it('validatorObject -> validators', () => {
    const Component = () => {
      useForm({ name: 'form' , validatorObject: {} })
      return null
    }
    render(<Component/>, { providerProps: { initialState: { form: {} } } })
    expect(console.warn).toBeCalledWith('validatorObject is being deprecated. Please use validators instead.')

    console.warn.mockReset()
    process.env.NODE_ENV = 'production'
    render(<Component/>, { providerProps: { initialState: { form: {} } } })
    expect(console.warn).not.toBeCalled()
    process.env.NODE_ENV = 'test'

  })

  it('validations -> Ø', () => {
    const Component = () => {
      useForm({ name: 'form' , validations: [], validators: {} })
      return null
    }
    render(<Component/>, { providerProps: { initialState: { form: {} } } })
    expect(console.warn).toBeCalledWith([
      'validations is being deprecated. You do not have to define it anymore.',
      'When submitting, all the validator functions defined in validators will be run.',
    ].join(' '))

    console.warn.mockReset()
    process.env.NODE_ENV = 'production'
    render(<Component/>, { providerProps: { initialState: { form: {} } } })
    expect(console.warn).not.toBeCalled()
    process.env.NODE_ENV = 'test'
  })
})


it('Initial state is correctly set', () => {
  const initialState = { form: { input: 'Default value' } }
  const Component = () => {
    const form = useForm({ name: 'form', validators: {} })
    return <input name="input" value={form.fields.input.value}/>
  }

  const { getByDisplayValue } = render(<Component/>, { providerProps: { initialState } })

  const input = getByDisplayValue(initialState.form.input)

  expect(input).toBeInTheDocument()

})

it('Throws an error if an input field has no defined validator', () => {
  const initialState = { form: { input: 'Default value' } }

  const Component = () => {
    const form = useForm({ name: 'form', validators: {} })
    return (
      <input
        name="input"
        value={form.fields.input.value}
        onChange={form.handleChange}
      />
    )
  }

  const { getByDisplayValue } = render(<Component/>, { providerProps: { initialState } })

  const input = getByDisplayValue(initialState.form.input)

  fireEvent.change(input, { target: { name: 'input', value: '' } })

  expect(console.error).toBeCalledWith(new Error('input has no validator defined in validators.'))

})


it('Error set to `true` on input if a change does not pass validation.', () => {
  const initialState = {
    form: {
      input1: 0,
      input2: 1
    }
  }

  const Component = () => {
    const form = useForm({
      name: 'form',
      validators: {
        input1: ({ input1, input2 }) => input1 + input2 === 2,
        input2: ({ input1, input2 }) => parseInt(input1, 10) + parseInt(input2, 10) === 2,
        customValidation: ({ input1, input2 }) => input1 + input2 === 2
      }
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
          onChange={customHandleChange(['customValidation'])}
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

  const { getByLabelText, queryByLabelText } = render(<Component/>, { providerProps: { initialState } })

  const input1 = getByLabelText('input 1')

  fireEvent.change(input1, { target: { name: 'input1', value: '2' } })

  expect(getByLabelText('input 1 and input 2 must equal 3')).toBeInTheDocument()

  const input2 = getByLabelText('input 2')

  fireEvent.change(input2, { target: { name: 'input2', value: '0' } })

  expect(queryByLabelText('input 2 error')).toBeNull()


  fireEvent.change(input2, { target: { name: 'input2', value: '1' } })

  expect(queryByLabelText('input 2 error')).toBeInTheDocument()

})


it('Throw error if name attribute is not specified on an input', () => {
  const initialState = { form: { input: 'Default value' } }

  const Component = () => {
    const form = useForm({ name: 'form', validators: {} })
    return (
      <input
        value={form.fields.input.value}
        onChange={form.handleChange}
      />
    )
  }

  const { getByDisplayValue } = render(<Component/>, { providerProps: { initialState } })

  const input = getByDisplayValue(initialState.form.input)

  fireEvent.change(input, { target: { value: '' } })
  expect(console.error)
    .toBeCalledWith(new Error('Invalid name attribute on input. Should be a string but was .'))
})

it('Checkboxes\' checked prop used as value when form event is passed to handleChange', () => {
  const initialState = { form: { input: false } }
  const Component = () => {
    const form = useForm({
      name: 'form',
      validators: { input: () => true }
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

  const { getByDisplayValue } = render(<Component/>, { providerProps: { initialState } })

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


describe('Submit', () => {
  it('validations', () => {

    const initialState = { form: { input1: 'valid', input2: 'validToo' } }

    const submitMock = jest.fn()
    const input1Validator = jest.fn().mockReturnValue(true)
    const input2Validator = jest.fn().mockReturnValue(true)
    const onNotify = jest.fn()

    const Component = () => {
      const form = useForm({
        name: 'form',
        validators: {
          input1: input1Validator,
          input2: input2Validator
        },
        submit: submitMock,
        onNotify
      })
      return (
        <form>
          <input
            value={form.fields.input1.value}
            onChange={form.handleChange}
          />
          <input
            value={form.fields.input2.value}
            onChange={form.handleChange}
          />
          <button type="submit" onClick={form.handleSubmit}>Submit</button>
        </form>
      )
    }
    const { getByText } = render(<Component/>, { providerProps: { initialState } })

    const submitButton = getByText(/Submit/)

    fireEvent.click(submitButton)

    expect(input1Validator).toBeCalledWith(initialState.form)
    expect(input2Validator).toBeCalledWith(initialState.form)
    expect(submitMock).toBeCalledWith({
      fields: initialState.form,
      finish: expect.any(Function),
      setLoading: expect.any(Function)
    })

    jest.resetAllMocks()
    input2Validator.mockReturnValue(false)
    fireEvent.click(submitButton)

    expect(onNotify).toBeCalledWith('submitError')
  })
})