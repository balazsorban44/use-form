import React, { useState, useEffect } from 'react'
import { FormProvider } from '../FormContext'
import useForm from '../useForm'

import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

jest.useFakeTimers()

it('setting defaults asnyc', () => {


  const ChildComponent = () => {
    const { fields } = useForm({ name: 'form', validators: {} })


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