import React, { useState, useEffect } from 'react'
import { render, act } from '@testing-library/react'
import { render as customRender } from '../test-utils'

import { FormProvider } from '../FormContext'
import useForm from '../useForm'


jest.useFakeTimers()


it('Initial state is correctly set', () => {
  const initialState = { form: { input: 'Default value' } }
  const Component = () => {
    const form = useForm({ name: 'form', validators: { input: () => true } })
    return <input name="input" defaultValue={form.fields.input.value}/>
  }

  const { getByDisplayValue } = customRender(<Component/>, { initialState } )

  const input = getByDisplayValue(initialState.form.input)

  expect(input).toBeInTheDocument()

})

it('setting initialState asnyc', () => {

  const ChildComponent = () => {
    const { fields } = useForm({ name: 'form', validators: { input: () => true } })


    return fields.input.value
  }

  const Component = () => {
    const [initialState, setInitialState] = useState({ form: { input: '' } })

    useEffect(() => {
      setTimeout(() => {
        setInitialState({ form: { input: 'VALUE' } })
      }, 100)
    }, [])


    return (
      <FormProvider initialState={initialState}>
        <ChildComponent/>
      </FormProvider>
    )
  }

  const { queryByText, getByText } = render(<Component/>)

  // first, there is nothing
  expect(queryByText('VALUE')).not.toBeInTheDocument()

  act(() => {jest.runAllTimers()})

  // new initialState is fetched
  expect(getByText('VALUE')).toBeInTheDocument()

})

it('invalid initialState throws error', () => {

  const ChildComponent = () => {
    const { fields } = useForm({ name: 'form' })
    return fields.input.value
  }

  const Component = () => {

    return (
      <FormProvider >
        <ChildComponent/>
      </FormProvider>
    )
  }

  expect(() => render(<Component/>)).toThrow([
    'The initial state for "form" is invalid.',
    'You can define an initialState in the FormProvider like this:',
    '<FormProvider options={{initialState: {formName: /*initial values here*/}}}>...',
  ].join(' '))


})