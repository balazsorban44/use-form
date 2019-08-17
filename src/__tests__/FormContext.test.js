import React, { useState, useEffect } from 'react'
import { FormProvider } from '../FormContext'
import { render, act } from '@testing-library/react'
import useForm from '../useForm'

import './utils/console.mock'
import { errors } from '../handleDevErrors'

it('can\'t use useForm outside FormProvider', () => {

  const App = () => {
    useForm({ name: 'form' })
    return null
  }

  expect(() => render(<App/>)).toThrowError(errors.outsideProvider)

  expect(() => render(
    <FormProvider>
      <App/>
    </FormProvider>
  )).not.toThrowError(errors.outsideProvider)

  // Don't throw in production
  const env = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  expect(() => render(<App/>)).not.toThrowError(errors.outsideProvider)
  process.env.NODE_ENV = env

})

it('require initialState prop', () => {

  const name = 'form'

  const App = () => {
    useForm({ name, onSubmit: jest.fn(), validators: {} })
    return null
  }

  const Component = ({ initialState }) => (
    <FormProvider initialState={initialState}>
      <App/>
    </FormProvider>
  )


  expect(() => render(<Component/>))
    .toThrowError(errors.initialState(name))

  const initialState = { [name]: {} }
  expect(() => render(<Component initialState={initialState}/>))
    .not
    .toThrowError(errors.initialState(name))

})

it('set initialState async', () => {
  jest.useFakeTimers()

  const App = () => {
    const { fields } = useForm({
      name: 'form',
      validators: { input: () => true },
      onSubmit: jest.fn()
    })

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
        <App/>
      </FormProvider>
    )
  }

  const { queryByText, getByText } = render(<Component/>)

  // first, there is nothing
  expect(queryByText('VALUE')).not.toBeInTheDocument()

  act(() => {jest.runAllTimers()})

  // new initialState is fetched
  expect(getByText('VALUE')).toBeInTheDocument()

  jest.useRealTimers()
})

it('onSubmit prop', () => {

  const App = () => {
    useForm({ name: 'form', validators: {} })
    return null
  }

  const Component = ({ onSubmit }) => (
    <FormProvider
      initialState={{ form: {} }}
      onSubmit={onSubmit}
    >
      <App/>
    </FormProvider>
  )


  expect(() => render(<Component/>))
    .toThrowError(errors.onSubmit())

  const onSubmit = jest.fn()
  expect(() => render(<Component onSubmit={onSubmit}/>))
    .not.toThrowError(errors.onSubmit(onSubmit))

})


it('validators prop', () => {

  const App = () => {
    useForm({ name: 'form', onSubmit: jest.fn() })
    return null
  }

  const Component = ({ validators }) => (
    <FormProvider
      initialState={{ form: { input: 'value' } }}
      validators={validators}
    >
      <App/>
    </FormProvider>
  )


  expect(() => render(<Component/>))
    .toThrowError(errors.validators())

  const validators = {}
  expect(() => render(<Component validators={validators}/>))
    .not
    .toThrowError(errors.validators(validators))
})