import React from 'react'
import { render, fireEvent } from '../test-utils'
import validatorsMock from './utils/validators.mock'
import useForm from '../useForm'

const initialStates = {
  form:  {
    text: 'text',
    radio: 'option-1',
    email: 'email',
    password: 'password',
    search: 'search',
    color: '#000',
    tel: 'tel',
    url: 'url',
    date: '2019-07-30',
    datetimeLocal: '2019-08-08T12:00',
    time: '12:00',
    week: '2019-W32',
    month: '2019-09',
    number: 0,
    range: 44,
    checkbox: false,
    select: '1'
  }
}

const providerProps = {
  initialStates,
  onSubmit: jest.fn()
}

describe('v3 input props', () => {
  const App = () => {
    const { fields, inputs, loading } = useForm({ name: 'form', validators: validatorsMock })

    return (
      <form>
        <fieldset>
          <legend>Strings:</legend>
          <input {...inputs.text('text')}/>
          <input {...inputs.email('email')}/>
          <input {...inputs.password('password')}/>
          <input {...inputs.search('search')}/>
          <label htmlFor="color">color</label>
          <input {...inputs.color('color')}/>
          <input {...inputs.tel('tel')}/>
          <input {...inputs.url('url')}/>
        </fieldset>

        <fieldset>
          <legend>Dates:</legend>
          {/* 'date', 'datetime-local', 'time', 'week', 'month'  */}
          <input {...inputs.date('date')}/>
          <input {...inputs.datetimeLocal('datetimeLocal')}/>
          <input {...inputs.time('time')}/>
          <input {...inputs.week('week')}/>
          <input {...inputs.month('month')}/>

        </fieldset>
        <fieldset>
          <legend>Selects:</legend>

          <radiogroup>
            <input {...inputs.radio('radio', { value: 'option-1' })}/>
            <input {...inputs.radio('radio', { value: 'option-2' })}/>
            <p>{fields.radio.value}</p>
          </radiogroup>

          <input {...inputs.checkbox('checkbox', 'checkbox-1')}/>

          <label htmlFor="select">select</label>
          <select {...inputs.select('select')}>
            <option value="select-1">select-1</option>
            <option value="select-2">select-2</option>
          </select>
        </fieldset>
        <input {...inputs.number('number')}/>
        <input {...inputs.range('range')}/>
        <label htmlFor="checkbox">checkbox</label>
        <button {...inputs.submit('Submit')}/>
      </form>
    )
  }


  const stringTypes = ['text', 'email', 'password', 'search', 'tel']
  stringTypes.forEach(type => {
    it(`Strings: ${type} input`, () => {
      const { getByDisplayValue } = render(<App/>, providerProps)
      fireEvent.change(
        getByDisplayValue(initialStates.form[type]),
        { target: { name: type, value: `new ${type}` } }
      )
      expect(getByDisplayValue(`new ${type}`)).toBeInTheDocument()
    })
  })

  it('color input', () => {
    const { getByLabelText } = render(<App/>, providerProps)
    fireEvent.input(
      getByLabelText('color'),
      { target: { name: 'color', value: '#ff7700' } }
    )
    expect(getByLabelText('color').attributes.getNamedItem('value').value).toBe('#ff7700')
  })


  const dateTypes = ['date', 'time', 'week', 'month', 'datetime-local']
  it('Dates: date input', () => {
    const { getByDisplayValue, debug } = render(<App/>, providerProps)

    const value = new Date().toISOString().slice(0, 10)

    fireEvent.change(
      getByDisplayValue(initialStates.form.date),
      { target: { name: 'date', value } }
    )
    expect(getByDisplayValue(value)).toBeInTheDocument()
  })

  it('Dates: datetime-local input', () => {
    const { getByDisplayValue, debug } = render(<App/>, providerProps)

    const value = new Date().toISOString().slice(0, 16)

    fireEvent.change(
      getByDisplayValue(initialStates.form.datetimeLocal),
      { target: { name: 'datetimeLocal', value } }
    )
    expect(getByDisplayValue(value)).toBeInTheDocument()
  })

  it('Dates: time input', () => {
    const { getByDisplayValue, debug } = render(<App/>, providerProps)

    const value = '14:00'

    fireEvent.change(
      getByDisplayValue(initialStates.form.time),
      { target: { name: 'time', value } }
    )
    expect(getByDisplayValue(value)).toBeInTheDocument()
  })

  it('Dates: week input', () => {
    const { getByDisplayValue, debug } = render(<App/>, providerProps)

    const value = '2019-W33'

    fireEvent.change(
      getByDisplayValue(initialStates.form.week),
      { target: { name: 'week', value } }
    )
    expect(getByDisplayValue(value)).toBeInTheDocument()
  })

  it('Dates: month input', () => {
    const { getByDisplayValue, debug } = render(<App/>, providerProps)

    const value = '2019-08'

    fireEvent.change(
      getByDisplayValue(initialStates.form.month),
      { target: { name: 'month', value } }
    )
    expect(getByDisplayValue(value)).toBeInTheDocument()
  })


  it('number input', () => {
    const { getByDisplayValue } = render(<App/>, providerProps)
    fireEvent.change(
      getByDisplayValue('0'),
      { target: { name: 'number', value: 1 } }
    )
    expect(getByDisplayValue('1')).toBeInTheDocument()
  })

  it('range input', () => {
    const { getByDisplayValue } = render(<App/>, providerProps)
    fireEvent.change(
      getByDisplayValue('44'),
      { target: { name: 'range', value: 50 } }
    )
    expect(getByDisplayValue('50')).toBeInTheDocument()
  })

  it('Selects: select', () => {
    const { getByDisplayValue, queryByDisplayValue, getByLabelText } = render(<App/>, providerProps)

    expect(queryByDisplayValue('select-2')).not.toBeInTheDocument()

    fireEvent.click(
      getByLabelText('select'),
      { target: { name: 'select', value: 'select-2' } }
    )

    expect(getByDisplayValue('select-2')).toBeInTheDocument()
  })

  it('Selects: radio input', () => {
    const { getByDisplayValue, queryByText } = render(<App/>, providerProps)
    expect(queryByText('option-2')).not.toBeInTheDocument()
    fireEvent.click(
      getByDisplayValue('option-2'),
      { target: { name: 'radio', value: 'option-2' } }
    )
    expect(queryByText('option-2')).toBeInTheDocument()
  })


  it.skip('Selects: checkbox input', () => {
    const { debug, getByLabelText } = render(<App/>, providerProps)
    fireEvent.click(
      getByLabelText('checkbox'),
      { target: { name: 'checkbox', checked: false } }
    )
    debug(getByLabelText('checkbox'))
  })


  it('Submit button', () => {
    const { getByText } = render(<App/>, providerProps)
    fireEvent.click(getByText('Submit'))
    expect(providerProps.onSubmit).toBeCalledWith(
      expect.objectContaining({
        name: 'form',
        fields: initialStates.form,
        notify: expect.any(Function),
        setLoading: expect.any(Function)
      })
    )

    expect(providerProps.onSubmit).toBeCalledTimes(1)

  })
})
