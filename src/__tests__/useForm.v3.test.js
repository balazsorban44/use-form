import React from 'react'
import useForm from '../useForm'
import { render, fireEvent, cleanup } from '../test-utils'


// Mock a validator that always returns true for any field
const validators = new Proxy({}, { get: () => () => true })


const initialState = {
  form:  {
    text: 'text',
    radio: 'option-1',
    email: 'email',
    password: 'password',
    search: 'search',
    color: '#000',
    tel: 'tel',
    url: 'url',
    date: new Date('2019-07-30'),
    'datetime-local': '',
    time: '',
    week: '',
    month: '',
    number: 0,
    range: 44,
    checkbox: false
  }
}

describe('v3 inputProps', () => {
  const Component = () => {
    const {
      fields,
      inputs: {
        text,
        email,
        password,
        search,
        color,
        tel,
        url,

        date,
        'datetime-local': datetime,

        radio,
        number,
        range,
        checkbox,
        ...rest
      }
    } = useForm({ name: 'form', validators, submit: () => null })

    return (
      <form>
        <fieldset>
          <legend>Strings:</legend>
          <input {...text('text')}/>
          <input {...email('email')}/>
          <input {...password('password')}/>
          <input {...search('search')}/>
          <label htmlFor="color">color</label>
          <input {...color('color')}/>
          <input {...tel('tel')}/>
          <input {...url('url')}/>
        </fieldset>

        <fieldset>
          <legend>Dates:</legend>
          <input {...date('date')}/>

        </fieldset>

        <radiogroup>
          <input {...radio('radio', 'option-1')}/>
          <input {...radio('radio', 'option-2')}/>
          <p>{fields.radio.value}</p>
        </radiogroup>
        <input {...number('number')}/>
        <input {...range('range')}/>
        <label htmlFor="checkbox">checkbox</label>
        <input {...checkbox('checkbox', 'checkbox-1')}/>
      </form>
    )
  }


  const stringTypes = ['text', 'email', 'password', 'search', 'tel']
  stringTypes.forEach(type => {
    it(`Strings: ${type} input`, () => {
      const { getByDisplayValue } = render(<Component/>, { initialState })
      fireEvent.change(
        getByDisplayValue(initialState.form[type]),
        { target: { name: type, value: `new ${type}` } }
      )
      expect(getByDisplayValue(`new ${type}`)).toBeInTheDocument()
    })
  })

  it('color input', () => {
    const { getByLabelText } = render(<Component/>, { initialState })
    fireEvent.input(
      getByLabelText('color'),
      { target: { name: 'color', value: '#ff7700' } }
    )
    expect(getByLabelText('color').attributes.getNamedItem('value').value).toBe('#ff7700')
  })

  it('radio input', () => {
    const { getByDisplayValue, queryByText } = render(<Component/>, { initialState })
    expect(queryByText('option-2')).not.toBeInTheDocument()
    fireEvent.click(
      getByDisplayValue('option-2'),
      { target: { name: 'radio', value: 'option-2' } }
    )
    expect(queryByText('option-2')).toBeInTheDocument()
  })


  // TODO: Dates
  const dateTypes = ['date', 'datetime-local', 'time', 'week', 'month']
  describe('Dates:', () => {
    it('date input', () => {
      const { getByDisplayValue } = render(<Component/>, { initialState })
      const now = new Date()
      fireEvent.change(
        getByDisplayValue(''),
        { target: { name: 'number', value: now } }
      )
      expect(getByDisplayValue(now.toDateString())).toBeInTheDocument()
    })
  })


  it('number input', () => {
    const { getByDisplayValue } = render(<Component/>, { initialState })
    fireEvent.change(
      getByDisplayValue('0'),
      { target: { name: 'number', value: 1 } }
    )
    expect(getByDisplayValue('1')).toBeInTheDocument()
  })

  it('range input', () => {
    const { getByDisplayValue } = render(<Component/>, { initialState })
    fireEvent.change(
      getByDisplayValue('44'),
      { target: { name: 'range', value: 50 } }
    )
    expect(getByDisplayValue('50')).toBeInTheDocument()
  })


  it.skip('checkbox input', () => {
    const { debug, getByLabelText } = render(<Component/>, { initialState })
    fireEvent.click(
      getByLabelText('checkbox'),
      { target: { name: 'checkbox', checked: false } }
    )
    debug(getByLabelText('checkbox'))
  })


})