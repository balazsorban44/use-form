import React from "react"

import { render as originalRender } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import { FormProvider } from '../FormContext'
import useForm from "../useForm"
import { fireEvent } from "@testing-library/react/dist";

beforeEach(() => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => {})
})

afterEach(() => console.error.mockRestore)

const render = (ui, {providerProps, ...options}={}) => originalRender(ui, {
  wrapper: ({children}) =>
    <FormProvider {...providerProps}>
      {children}
    </FormProvider>
  , ...options })


  
it("Throws an error if a form is not defined in the FormProvider's initialState", () => {
  const Component = () => {
    useForm({name: "form"})
    return null
  }
    
  expect(() => render(<Component/>)).toThrow(new Error([
      "The initial state for \"form\" was undefined. You can define an initialState in the FormProvider like this: ",
      "<FormProvider options={{initialState: {formName: /*initial values here*/}}}>..."
    ].join("")))
})

it("Initial state is correctly set", () => {
  const initialState = {form: {input: "Default value"}}
  const Component = () => {
    const form = useForm({name: "form"})
    return <input name="input" value={form.fields.input.value}/>
  }

  const {getByDisplayValue} = render(<Component/>, {providerProps: {initialState}})

  const input = getByDisplayValue(initialState.form.input)

  expect(input).toBeInTheDocument()

})


it.skip("Throws an error if an input field has no defined validator", () => {
  const initialState = {form: {input: "Default value"}}

  const Component = () => {
    const form = useForm({name: "form"})
    return (
      <input
        name="input"
        value={form.fields.input.value}
        onChange={form.handleChange}
      />
    )
  }

  const {getByDisplayValue} = render(<Component/>, {providerProps: {initialState}})
    
  const input = getByDisplayValue(initialState.form.input)

  expect(() => fireEvent.change(input, {target: {name: "input", value: ""}}))
    .toThrow(new Error("input has no validator in validatorObject"))
})


it("Error set to `true` on input if a change does not pass validation.", () => {
  const initialState = {form: {
    input1: 0,
    input2: 1,
  }}

  const Component = () => {
    const form = useForm({
      name: "form",
      validatorObject: {
        input1: ({input1, input2}) => input1 + input2 === 2,
        input2: ({input1, input2}) => parseInt(input1, 10) + parseInt(input2, 10) === 2,
        customValidation: ({input1, input2}) => input1 + input2 === 2
      }
    })

    const customHandleChange = (validations=[]) => ({target: {name, value}}) => {
      form.handleChange({[name]: parseInt(value, 10)}, validations)
    }

    return (
      <form onSubmit={form.handleSubmit}>
        <label htmlFor="input1">
          {form.fields.input1.error ? "input 1 and input 2 must equal 3" : "input 1"}
        </label>
        <input
          name="input1"
          id="input1"
          value={form.fields.input1.value}
          onChange={customHandleChange(["customValidation"])}
        />
        <label htmlFor="input2">{form.fields.input2.error ? "input 2 error" : "input 2"}</label>
        <input
          name="input2"
          id="input2"
          value={form.fields.input2.value}
          onChange={form.handleChange}
        />
      </form>
    )
  }

  const {getByLabelText, queryByLabelText} = render(<Component/>, {providerProps: {initialState}})
    
  const input1 = getByLabelText("input 1")
  
  fireEvent.change(input1, {target: {name: "input1", value: "2"}})
  
  expect(getByLabelText("input 1 and input 2 must equal 3")).toBeInTheDocument()
  
  const input2 = getByLabelText("input 2")

  fireEvent.change(input2, {target: {name: "input2", value: "0"}})

  expect(queryByLabelText("input 2 error")).toBeNull()


  fireEvent.change(input2, {target: {name: "input2", value: "1"}})

  expect(queryByLabelText("input 2 error")).toBeInTheDocument()
  
})


it.skip("Throw error if name attribute is not specified on an input", () => {
  const initialState = {form: {input: "Default value"}}

  const Component = () => {
    const form = useForm({name: "form"})
    return (
      <input
        value={form.fields.input.value}
        onChange={form.handleChange}
      />
    )
  }

  const {getByDisplayValue} = render(<Component/>, {providerProps: {initialState}})
    
  const input = getByDisplayValue(initialState.form.input)

  expect(
    () => fireEvent.change(input, {target: {value: ""}})
  )
    .toThrow(new Error(`Invalid name attribute on input. Should be a string but was .`))
})