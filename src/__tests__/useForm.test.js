import React from 'react'
import { render, fireEvent, cleanup } from '../test-utils'

import useForm from '../useForm'


describe('warns about future changes', () => {
  it('validatorObject changed to validators', () => {
    const Component = () => {
      useForm({ name: 'form' , validatorObject: {} })
      return null
    }
    render(<Component/>, { initialState: { form: {} } } )
    expect(console.warn).toBeCalledWith('validatorObject is being deprecated. Please use validators instead.')

    console.warn.mockReset()
    process.env.NODE_ENV = 'production'
    render(<Component/>, { initialState: { form: {} } } )
    expect(console.warn).not.toBeCalled()
    process.env.NODE_ENV = 'test'

  })

  it('validations not required anymore', () => {
    const Component = () => {
      useForm({ name: 'form' , validations: [], validators: {} })
      return null
    }
    render(<Component/>, { initialState: { form: {} } } )
    expect(console.warn).toBeCalledWith([
      'validations is being deprecated. You do not have to define it anymore.',
      'When submitting, all the validator functions defined in validators will be run.',
    ].join(' '))

    console.warn.mockReset()
    process.env.NODE_ENV = 'production'
    render(<Component/>, { initialState: { form: {} } })
    expect(console.warn).not.toBeCalled()
    process.env.NODE_ENV = 'test'
  })
})


it('input field has no defined validator throws error', () => {

  const Component = () => {
    useForm({ name: 'form', validators: {} })
    return null
  }

  expect(() => render(
    <Component/>,
    { initialState: { form: { input: '' } } }
  ))
    .toThrow('You forgot to define a validator in "form" for the field: input')
})


it('invalid validator throws error', () => {

  const Component = ({ validators }) => {
    useForm({ name: 'form', validators })
    return null
  }

  expect(() => render(
    <Component/>,
    { initialState: { form: { input: '' } } }
  ))
    .toThrow('validators must be an object, but it was undefined.')

  expect(() => render(
    <Component
      validators={{ input: () => null }}
    />,
    { initialState: { form: { input: '' } } }
  ))
    .toThrow([
      'The validator for input in validators did not return a boolean.',
      'To validate a field, define a function that returns',
      'true if valid, and false if invalid.',
    ].join(' '))

})

it('invalid name throws error', () => {

  const Component = ({ name }) => {
    useForm({ name, validators: {} })
    return null
  }

  expect(() => render(
    <Component name="name"/>,
    { initialState: { name: {} } } )
  )
    .not.toThrow()

  expect(() => render(<Component/>)).toThrow('name must be a string, but it was undefined.')
  expect(() => render(<Component name={{}}/>)).toThrow('name must be a string, but it was object.')
  expect(() => render(<Component name={() => null}/>)).toThrow('name must be a string, but it was function.')

})

it('not specified name attribute on an input throws error', () => {
  const initialState = { form: { input: 'default value' } }

  const Component = () => {
    const form = useForm({ name: 'form', validators: { input: () => true } })
    return (
      <input
        value={form.fields.input.value}
        onChange={form.handleChange}
      />
    )
  }

  const { getByDisplayValue } = render(<Component/>, { initialState } )

  const input = getByDisplayValue(initialState.form.input)

  fireEvent.change(input, { target: { value: '' } })
  expect(console.error)
    .toBeCalledWith(new Error('Invalid name attribute on input. "" must be present in the form.'))
})


// TODO: Simplify
it('handleChange validates', () => {
  const initialState = {
    form: {
      input1: 0,
      input2: 1
    }
  }

  const onNotify = jest.fn()

  const Component = () => {
    const form = useForm({
      name: 'form',
      validators: {
        input1: ({ input1, input2 }) => input1 + input2 === 2,
        input2: ({ input1, input2 }) => parseInt(input1, 10) + parseInt(input2, 10) === 2,
        customValidation: ({ input1, input2 }) => input1 + input2 === 2
      },
      onNotify
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

  const { getByLabelText, queryByLabelText } = render(<Component/>, { initialState } )

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
  expect(onNotify).toBeCalledWith('validationError', 'input1')
  expect(onNotify).toBeCalledWith('validationError', 'input2')


  jest.resetAllMocks()
})

it('if custom change parameters used, and name is not in the form, throw error ', () => {
  const Component = () => {
    const form = useForm({ name: 'form', validators: { input: () => true } })

    return (
      <div>
        <label htmlFor="input">input</label>
        <input
          onChange={() => {form.handleChange({ name: 'value' })}}
          id="input"
          name="input"
          value="value"
        />
      </div>
    )
  }

  const { getByLabelText } = render(<Component/>, { initialState: { form: { input: '' } } })

  fireEvent.change(getByLabelText('input'), { target: { name: 'input', value: '' } })

  expect(console.error).toBeCalledWith(new TypeError('Invalid fields object. Are all the keys present in the form?'))


})

// TODO: Simplify
it('handleSubmit validates', () => {

  const initialState = { form: { input1: 'valid', input2: 'validToo' } }


  // ---------------- TODO: add expects
  const onFinished = jest.fn()
  const submitMock = jest.fn(({ finish }) => {
    finish()
  })
  // -----------------

  const input1Spy = jest.fn()
  const input2Spy = jest.fn()

  const onNotify = jest.fn()

  const Component = ({ input2Result = true }) => {
    const form = useForm({
      name: 'form',
      validators: {
        input1: (...args) => {
          input1Spy(...args)
          return true
        },
        input2: (...args) => {
          input2Spy(...args)
          return input2Result
        }
      },
      submit: submitMock,
      onNotify,
      onFinished
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
  const { getByText } = render(<Component/>, { initialState } )

  const submitButton = getByText(/Submit/)

  fireEvent.click(submitButton)

  expect(input1Spy).toBeCalledWith(initialState.form)
  expect(input2Spy).toBeCalledWith(initialState.form)
  expect(submitMock).toBeCalledWith({
    fields: initialState.form,
    finish: expect.any(Function),
    setLoading: expect.any(Function)
  })

  jest.resetAllMocks()

  cleanup()

  const { getByText: getByText2 } = render(<Component input2Result={false}/>, { initialState } )

  const submitButton2 = getByText2(/Submit/)

  fireEvent.click(submitButton2)

  expect(onNotify).toBeCalledWith('submitError')
})


it('checkboxes\' checked prop used as value when form event is passed to handleChange', () => {
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

  const { getByDisplayValue } = render(<Component/>, { initialState } )

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