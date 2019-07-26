import React from 'react'
import { render } from '@testing-library/react'

import { FormProvider } from './FormContext'


beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
  console.warn.mockRestore()
})

const customRender = (ui, { initialState, ...options } = {}) => render(ui, {
  wrapper: ({ children }) =>
    <FormProvider initialState={initialState}>
      {children}
    </FormProvider>
  , ...options
})

export * from '@testing-library/react'
export { customRender as render }