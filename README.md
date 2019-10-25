<div align="center">
<h1>another-use-form-hook</h1>

<p>A React hook 🎣 for easy form handling</p>

</div>

---


[![Build Status][build-badge]][build] [![Code Coverage][coverage-badge]][coverage] [![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] [![Watch on GitHub][github-watch-badge]][github-watch] [![Star on GitHub][github-star-badge]][github-star]

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
  - [useForm](#useform)
    - [UseFormParams](#useformparams)
      - [InitialState](#initialstate)
      - [Validators](#validators)
      - [SubmitCallback](#submitcallback)
      - [NotifyCallback](#notifycallback)
    - [UseForm](#useform)
      - [FieldValuesAndErrors](#fieldvaluesanderrors)
      - [ChangeHandler](#changehandler)
      - [SubmitHandler](#submithandler)
      - [InputPropGenerators](#inputpropgenerators)
  - [FormProvider](#formprovider)
    - [FormProviderProps](#formproviderprops)
  - [getForms](#getforms)
    - [Forms](#forms)
- [LICENSE](#license)


## Installation
This should be installed as one of your project `dependencies`:

```
yarn add another-use-form-hook
```
or
```
npm install --save another-use-form-hook
```

> NOTE: `another-use-form-hook` only works with [**react >=16.8**][react-hooks], since it is a hook.

## Usage

This hook is intended to give a full solution for handling forms. From interdependent field value validations (meaning if a field value is dependent on other field value), to submitting the form, and providing information about when the UI should be unresponsive (loading of some kind of asnyc-like operation), in addition to notification "hooks" to be able to inform the users the most efficient way.

To retrieve props for an input field, you have the following options:
 1. Using the `form.inputs.{inputType}('name')` input prop generator function (`inputTypes` is one of [these][input-types-mdn])
 2. Using `form.fields.{name}.{value|error}` and `form.handleChange` functions

> NOTE: The example below is available live at [CodeSandbox][codesandbox-example]
>
Let's see a complex example to understand how it works:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import useForm from "another-use-form-hook";
import "./styles.css";
/**
 * NOTE: We are using date-fns for this example,
 * but it is absolutly not a requirement.
 */
import { addDays, isAfter, differenceInDays, parseISO } from "date-fns";
const isValidEmail = email => /\w*@\w*\.\w*/.test(email); // Do better 💩

const TODAY = new Date();

const App = () => {
  const form = useForm({
    initialState: {
      email: "",
      arrival: TODAY,
      departure: TODAY
    },
    validators: (fields, isSubmitting) => ({
      // if not submitting, don't throw errors for invalid e-mail, like an empty field
      email: isSubmitting
        ? isValidEmail(fields.email)
        : typeof fields.email === "string",
      // earliest arrival must be tomorrow
      arrival: isAfter(parseISO(fields.arrival), TODAY),
      // earliest departure must be after tomorrow
      departure: isAfter(addDays(parseISO(fields.departure), 1), TODAY),
      // departure must be at least a day after arrival
      minOneNight: isSubmitting
        ? differenceInDays(
            parseISO(fields.departure),
            parseISO(fields.arrival)
          ) >= 1
        : true
    }),
    onNotify: (type, reason) => {
      // you can use type and reason to send specific notifications to the user
      switch (type) {
        case "submitError":
          console.error("Form could not be submitted: ", reason);
          break;
        case "submitSuccess":
          console.info("Form has been submitted.", reason);
          break;
        case "validationErrors":
          console.warn(
            "The following problems occurred while validating: ",
            reason
          );
          break;
        default:
          break;
      }
    },
    onSubmit: async ({ fields, setLoading, notify }) => {
      try {
        setLoading(true);
        // submitting the form, eg.: fetch("path/to/my/submit")
        const response = await new Promise(resolve => {
          setTimeout(() => {
            console.log("Submitting: ", fields);
            resolve(fields);
          }, 1000);
        });
        notify("submitSuccess", response);
      } catch (error) {
        notify("submitError", error.message);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* option 1 (control all the props with a one-liner)*/}
      <fieldset>
        <legend>Option 1</legend>

        <label htmlFor="email">
          {form.fields.email.error ? "Invalid" : ""} email
        </label>
        <input {...form.inputs.email("email")} />

        <label htmlFor="departure">
          {form.fields.arrival.error ? "Invalid" : ""} arrival
        </label>
        <input
          {...form.inputs.date("arrival")}
          // You can override props by simply defining them last
          onChange={e => form.handleChange(e, ["minOneNight"])}
        />
      </fieldset>

      {/* option 2 specify id, type, name, value props manually*/}
      <fieldset>
        <legend>Option 2</legend>
        <label htmlFor="arrival">
          {form.fields.arrival.error ? "Invalid" : ""} arrival
        </label>
        <input
          type="date"
          id="arrival"
          name="arrival"
          value={form.fields.arrival.value}
          onChange={e => form.handleChange(e, ["minOneNight"])}
        />

        <label htmlFor="departure">
          {form.fields.departure.error ? "Invalid" : ""} departure
        </label>
        <input
          type="date"
          id="departure"
          name="departure"
          value={form.fields.departure.value}
          onChange={e => form.handleChange(e, ["minOneNight"])}
        />
      </fieldset>

      {/* also from option 1 */}
      <button {...form.inputs.submit()} disabled={form.loading}>
        Submit
      </button>
    </form>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
```

## Documentation

### useForm

```ts
  useForm(useFormParams: UserFormParams): UseForm
```

#### UseFormParams

| name         | type                              |                                                                                                      description |
| :----------- | :-------------------------------- | ---------------------------------------------------------------------------------------------------------------: |
| name         | `string`                          | Used toidentify one of the forms in `initialStates` and `validators` in [FormProviderProps](#formproviderprops). |
| initialState | [InitialState](#initialstate)     |                                                                          The default value of every input field. |
| validators   | [Validators](#validators)         |                            A function that returns an object to validate every field value at change and submit. |
| onSubmit     | [SubmitCallback](#submitcallback) |                                              A callback function that is invoked when the user submits the form. |
| onNotify     | [NotifyCallback](#notifycallback) |          Invoked when a validation error occurs, or can be invoked to notify the user about a successful submit. |

##### InitialState
##### Validators
##### SubmitCallback
##### NotifyCallback

#### UseForm

| name         | type                                          |                                                                                                                description |
| :----------- | :-------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------: |
| name         | `string`                                      |                                                                                Same as in [UseFormParams](#useformparams). |
| fields       | [FieldValuesAndErrors](#fieldvaluesanderrors) |                                                                                   Validated field values and their errors. |
| hasErrors    | `boolean`                                     |                                                                                                                            |
| handleChange | [ChangeHandler](#changehandler)               |                                                                                                                            |
| handleSubmit | [SubmitHandler](#submithandler)               |                                                                                                                            |
| loading      | `boolean`                                     |                                                                                                                            |
| inputs       | [InputPropGenerators](#inputpropgenerators)   |                                                                                                                            |
| validators   | [Validators](#validators)                     | Useful if you defined `validators` in [FormProviderProps](#formproviderprops), and you need the current form's validators. |

##### FieldValuesAndErrors
##### ChangeHandler
##### SubmitHandler
##### InputPropGenerators

### FormProvider

```ts
  function FormProvider(formProviderProps: FormProviderProps): JSX.Element
```

#### FormProviderProps

| name          | type                              |                                                                                                 description |
| :------------ | :-------------------------------- | ----------------------------------------------------------------------------------------------------------: |
| initialStates | `{[key: string]: InitialState}`   | `key` is the name of a form, defined in [UseFormParams](#useformparams). See [InitialState](#initialState). |
| validators    | `{[key: string]: Validators}`     |     `key` is the name of a form, defined in [UseFormParams](#useformparams). See [Validators](#validators). |
| onSubmit      | [SubmitCallback](#submitcallback) |                                                      Same as `onSubmit` in [UseFormParams](#useformparams). |
| onNotify      | [NotifyCallback](#notifycallback) |                                                      Same as `onNotify` in [UseFormParams](#useformparams). |
| children      | `ReactElement`                    |                                                     The element you would like to wrap with `FormProvider`. |



### getForms
```ts
  function getForms() : Forms
```

#### Forms
It is an object containing all the forms' current values in [FormProvider](#formprovider).


---

## LICENSE

MIT

[build-badge]:
  https://img.shields.io/travis/balazsorban44/use-form.svg?style=flat-square
[build]: https://travis-ci.org/balazsorban44/use-form
[coverage-badge]:
  https://img.shields.io/codecov/c/github/balazsorban44/use-form.svg?style=flat-square
[coverage]: https://codecov.io/github/balazsorban44/use-form
[version-badge]:
  https://img.shields.io/npm/v/another-use-form-hook.svg?style=flat-square
[package]: https://www.npmjs.com/package/another-use-form-hook
[downloads-badge]:
  https://img.shields.io/npm/dm/another-use-form-hook.svg?style=flat-square

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org

[npmtrends]: http://www.npmtrends.com/another-use-form-hook
[license-badge]:
  https://img.shields.io/npm/l/another-use-form-hook.svg?style=flat-square
[license]:
  https://github.com/balazsorban44/use-form/blob/master/LICENSE
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]:
  https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]:
  https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]:
  https://github.com/balazsorban44/use-form/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]:
  https://img.shields.io/github/watchers/balazsorban44/use-form.svg?style=social
[github-watch]: https://github.com/balazsorban44/use-form/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/balazsorban44/use-form.svg?style=social
[github-star]: https://github.com/balazsorban44/use-form/stargazers
[react-hooks]: https://reactjs.org/blog/2019/02/06/react-v16.8.0.html
[input-types-mdn]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
[codesandbox-example]: https://codesandbox.io/s/another-use-form-hook-2mler