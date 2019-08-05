<div align="center">
<h1>another-use-form-hook</h1>

<p>A React hook 🎣 for easy form handling</p>

</div>

---


[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]

[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends] [![MIT License][license-badge]][license]

[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

---

> ⚠ WARNING! This is still in development! ⚠

> I am new to many things here... semantic-release, npm publishing and TypeScript is all the stuff I haven't tried before, so please excuse me for the "messy" start. I am hoping to keep everything clean from now on...
The documentation is still missing, and there are some rough edges on the inside, so please use with caution! Other than that, please enjoy! ✨💖🚀

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
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

## Usage

> NOTE: This section is a work in progress.

This hook is intended to give a full solution for handling forms. From interdependent field value validations (meaning if a field value is dependent on anothers' values), to submitting the form, and providing information about when the UI should be unresponsive (loading of some kind of asnyc-like operation), in addition to notification "hooks" to be able to inform the users the most efficient way.

Let's see a complex example, to understand how it works, and what are its capabilities:


```jsx
import React from "react"
import ReactDOM from "react-dom"
import useForm, {FormProvider} from "another-use-form-hook"

/**
 * NOTE: We are using date-fns for this example,
 * but it is absolutly not a requirement.
 */
import {addDays, isAfter, differenceInDays} from "date-fns"


const TODAY = new Date()


const App = () => {
  const form = useForm({
    name: "form",
    validators: {
      // Earliest arrival tomorrow
      arrival: ({arrival}) => isAfter(arrival, TODAY),
      // Earliest departure day after tomorrow
      departure: ({departure}) => isAfter(addDays(departure, 1), TODAY),
      // Arrival and departure depends on each other to be valid.
      minOneNight: ({arrival, departure}) => differenceInDays(departure, arrival) >= 1
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>

      <label htmlFor="arrival">
        { form.fields.arrival.error ? "Invalid" : "" } arrival
      </label>
      <input 
        id="arrival"
        name="arrival"
        value={form.fields.arrival.value}
        onChange={e => form.handleChange(e, ["minOneNight"])}
      />

      <label htmlFor="departure">
        { form.fields.departure.error ? "Invalid" : "" } departure
      </label>
      <input 
        id="departure"
        name="departure"
        value={form.fields.departure.value}
        onChange={e => form.handleChange(e, ["minOneNight"])}
      />

    </form>
  )
}

ReactDOM.render(
  <FormProvider initialState={{
    form: {
      arrival: TODAY,
      departure: addDays(TODAY, 1)
    }
  }}>
    <App/>
  </FormProvider>
  , document.querySelector("#root"))
```


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
