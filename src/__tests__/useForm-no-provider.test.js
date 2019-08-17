import React from 'react'
import useForm from '../useForm'
import { render, fireEvent } from '@testing-library/react'
import validatorsMock from './utils/validators.mock'

it('works without provider', () => {
  const form = {
    initialState: { input: 'initial value' },
    validators: validatorsMock,
    onSubmit: jest.fn()
  }
  const App = () => {
    const { inputs } = useForm(form)
    return <input {...inputs.text('input')}/>
  }

  const { debug, getByDisplayValue } = render(<App/>)

  fireEvent.change(
    getByDisplayValue(form.initialState.input),
    { target: { name: 'input', value: 'new value' } }
  )

  expect(getByDisplayValue('new value')).toBeInTheDocument()
})