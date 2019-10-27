<div align="center">
<h1>another-use-form-hook</h1>

<p>A React hook 🎣 for easy form handling</p>

</div>

---


[![Build Status][build-badge]][build] [![Code Coverage][coverage-badge]][coverage] [![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch] [![Star on GitHub][github-star-badge]][github-star]

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
        - [Validations](#validations)
      - [SubmitCallback](#submitcallback)
      - [NotifyCallback](#notifycallback)
    - [UseFormReturn](#useformreturn)
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

This hook is intended to give a full solution for handling forms. From interdependent field value validations (meaning if a field value is dependent on other field value), to submitting the form, and providing information about when the UI should be unresponsive (loading of some kind of async-like operation), in addition to notification "hooks" to be able to inform the users the most efficient way.

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

| name         | type       |                                                          description |
| :----------- | :--------- | -------------------------------------------------------------------: |
| name         | `string`   | Refer to one of the forms in [formProviderProps](#formproviderprops) |
| initialState | `object`   |                                    See [InitialState](#initialstate) |
| validators   | `function` |                                        See [Validators](#validators) |
| onSubmit     | `function` |                                See [SubmitCallback](#submitcallback) |
| onNotify     | `function` |                                See [NotifyCallback](#notifycallback) |

##### InitialState
An object containing the default value of every field in a form.
> Example:
```js
useForm({
  initialState: {
    email: "",
    name: "",
    address: "",
    age: 0
  }
})
```

If `name` is defined, you can refer to `initialStates.{name}` in [formProviderProps](#formproviderprops).

> Example:
```jsx
//...
<FormProvider 
  initialStates={{
    login: {
      email: "email@example.com",
      password: ""
    }
  }}
>
//...
const form = useForm({name: "login"})
console.log(form.fields.email.value) // email@example.com
```

##### Validators
This function is invoked before [onChange](#changecallback) and [onSubmit](#submitcallback). The former only runs the validations for the changed fields, while the latter runs it on the whole form. For convenience, it is also returned from `useForm`.
```ts
function validators(fields: object, isSubmitting: boolean): Validations
```

| name        | type      |                                                      description |
| :---------- | :-------- | ---------------------------------------------------------------: |
| fields      | `object`  |   An object with the same shape as [initialState](#initialstate) |
| submitting  | `boolean` | Set to `true`, when called before [handleSubmit](#submithandler) |
| validations | `object`  |                                  See [Validations](#validations) |

###### Validations
An object containing `boolean` expressions. Each input field must have at least a corresponding property in this object, but you can define custom ones as well.
> Example:
```js
{
  email: submitting
    ? isValidEmail(fields.email)
    : typeof fields.email === "string"
}
```
You can also look at the [live example](#usage).


##### SubmitCallback
Invoked when [handleSubmit](#submithandler) is called and there were no validation issues.

```ts
function onSubmit(onSubmitParams: OnSubmitParams): void
```


| name       | type       |                                                       description |
| :--------- | :--------- | ----------------------------------------------------------------: |
| name       | `string`   |                 Same as `name` in [useFormParams](#useformparams) |
| fields     | `object`   |     Validated fields, same shape as [initialState](#initialstate) |
| setLoading | `function` | Sets the returned `loading` property of [useForm](#useformreturn) |
| notify     | `function` |                             See [NotifyCallback](#notifycallback) |

##### NotifyCallback
Invoked if there is a validation error when calling `handleChange` or `handleSubmit`. Can be manually triggered on `onSubmit` by calling `notify`.

```ts
type NotifyType = "validationErrors" | "submitError" | "submitSuccess"
function notify(type: NotifyType, reason: any): void
```

| name   | type     |                                                                                              description |
| :----- | :------- | -------------------------------------------------------------------------------------------------------: |
| type   | `string` |                                                                                     Type of notification |
| reason | `any`    | When type is `validationErrors`, it is a list of field names, Otherwise you set it to whatever you want. |

> Example:

Look at the [live example](#usage).


#### UseFormReturn

| name         | type       |                                                                   description |
| :----------- | :--------- | ----------------------------------------------------------------------------: |
| name         | `string`   |                                   Same as in [useFormParams](#useformparams). |
| fields       | `object`   |                             See [FieldValuesAndErrors](#fieldvaluesanderrors) |
| hasErrors    | `boolean`  | For convenience. `true` if any of the returned fields.{name}.error is `true`. |
| handleChange | `function` |                                           See [ChangeHandler](#changehandler) |
| handleSubmit | `function` |                                           See [SubmitHandler](#submithandler) |
| loading      | `boolean`  |                     Controlled by `setLoading` in [onSubmit](#submitcallback) |
| inputs       | `object`   |                               See [InputPropGenerators](#inputpropgenerators) |
| validators   | `function` |                                                 See [Validators](#validators) |

##### FieldValuesAndErrors
Validated field values and their errors.
> Example:

```js
  const form = useForm({initialState: {
    email: "email@example.com",
    age: -2
  }})
  console.log(form.fields)
  // {
  //  email: {
  //   value: "email@example.com",
  //   error: false
  //  },
  //  age: {
  //   value: -2,
  //   error: truefields
  //  }
  // }
  console.log(form.hasErrors) // true
```
##### ChangeHandler
You can call this two ways. Either pass an event as the first argument, or a partial `fields` object. With the latter, you can change multiple values at the same time. Eg.: resetting the form after submit, or any other reason you might have.
```ts
function handleChange(event: React.FormEvent, validations: string[]): void
function handleChange(fields: object, validations: string[]): void
```
| name        | type              |                                                                                                      description |
| :---------- | :---------------- | ---------------------------------------------------------------------------------------------------------------: |
| event       | `React.FormEvent` |                                       Standard event. Using `target.{name|value|checked}` to infer the intention |
| fields      | `object`          |                           Pass a partial `fields` object, if you want to change multiple values at the same time |
| validations | `string[]`        | Which `validators` you would like to run. If omitted, only validators with the same event/field name will be run |

> Example:

Look at the [live example](#usage).

##### SubmitHandler
Call to submit the form. Before [onSubmit](#submitcallback) is invoked, [validators](#validators) is run for every form field. If there were any errors, [notify](#notifycallback) is invoked with `type` being `validationErrors`, and `reason` a list of form field names.

```ts
function handleSubmit(): void
```


##### InputPropGenerators
> TODO

### FormProvider

```ts
  function FormProvider(formProviderProps: FormProviderProps): JSX.Element
```

#### FormProviderProps

| name          | type           |                                                                                 description |
| :------------ | :------------- | ------------------------------------------------------------------------------------------: |
| initialStates | `object`       | Single place to define all `initialState` for every form. See [InitialState](#initialState) |
| validators    | `object`       |      Single place to define all `validators` for every form. See  [Validators](#validators) |
| onSubmit      | `function`     |                                                         Same as [onSubmit](#submitcallback) |
| onNotify      | `function`     |                                                         Same as [onNotify](#notifycallback) |
| children      | `ReactElement` |                                      The element you would like to wrap with `FormProvider` |



### getForms
```ts
  function getForms() : Forms
```

#### Forms
An object containing all the forms' current values in [FormProvider](#formprovider). Same shape as `initialStates`.


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