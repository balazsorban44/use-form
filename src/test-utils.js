import React from 'react'
import { render } from '@testing-library/react'

import { FormProvider } from './FormContext'


import './__tests__/utils/console.mock'

const customRender = (ui, { initialStates, validators, onSubmit, onNotify, ...options } = {}) => render(ui, {
  wrapper: ({ children }) =>
    <FormProvider
      initialStates={initialStates}
      validators={validators}
      onSubmit={onSubmit}
      onNotify={onNotify}
    >
      {children}
    </FormProvider>
  , ...options
})

export * from '@testing-library/react'
export { customRender as render }