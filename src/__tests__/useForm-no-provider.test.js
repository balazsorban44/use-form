import React, { useState, useEffect } from 'react'
import useForm from '../useForm'
import { render, fireEvent, waitForElement } from '@testing-library/react'
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

  const { getByDisplayValue } = render(<App/>)

  fireEvent.change(
    getByDisplayValue(form.initialState.input),
    { target: { name: 'input', value: 'new value' } }
  )

  expect(getByDisplayValue('new value')).toBeInTheDocument()
})


it('set initialState async', async () => {

  const App = () => {
    const [initialState, setInitialState] = useState({ input: 'initial value' })

    useEffect(() => {
      setTimeout(() => {
        setInitialState({ input: 'VALUE' })
      }, 100)
    }, [])
    const form = {
      initialState,
      validators: validatorsMock,
      onSubmit: jest.fn()
    }
    const { inputs } = useForm(form)
    return <input {...inputs.text('input')}/>
  }

  const { getByDisplayValue } = render(<App/>)

  await waitForElement(() => getByDisplayValue('VALUE'))

  expect(getByDisplayValue('VALUE')).toBeInTheDocument()
})