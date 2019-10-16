# Table of contents

* [index.d.ts][SourceFile-0]
    * Functions
        * [useForm][FunctionDeclaration-0]
        * [getForms][FunctionDeclaration-1]
        * [FormProvider][FunctionDeclaration-2]
        * [validate][FunctionDeclaration-3]
    * Interfaces
        * [ChangeHandler][InterfaceDeclaration-0]
        * [UseForm][InterfaceDeclaration-1]
        * [FormProviderProps][InterfaceDeclaration-4]
        * [FieldValueAndError][InterfaceDeclaration-2]
        * [GeneratedProps][InterfaceDeclaration-3]
        * [ValidateParams][InterfaceDeclaration-5]
    * Types
        * [SubmitCallback][TypeAliasDeclaration-0]
        * [Form][TypeAliasDeclaration-12]
        * [Forms][TypeAliasDeclaration-13]
        * [NotificationHandler][TypeAliasDeclaration-14]
        * [FieldValues][TypeAliasDeclaration-9]
        * [FieldValuesAndErrors][TypeAliasDeclaration-4]
        * [InputTypes][TypeAliasDeclaration-6]
        * [GenericObject][TypeAliasDeclaration-15]
        * [GeneratePropsFunc][TypeAliasDeclaration-8]
        * [InputPropGenerator][TypeAliasDeclaration-7]
        * [InputPropGenerators][TypeAliasDeclaration-5]
        * [SubmitError][TypeAliasDeclaration-16]
        * [ValidationErrors][TypeAliasDeclaration-17]
        * [SubmitNotificationType][TypeAliasDeclaration-1]
        * [NotificationType][TypeAliasDeclaration-3]
        * [Reason][TypeAliasDeclaration-18]
        * [NotifyCallback][TypeAliasDeclaration-2]
        * [Errors][TypeAliasDeclaration-11]
        * [Validators][TypeAliasDeclaration-10]
    * Variables
        * [default][VariableDeclaration-0]

# index.d.ts

## Functions

### useForm

Set up a form, or hook into one deifned in `FormProvider`.

```typescript
function useForm<N extends string, F extends FieldValues, V extends Validators<F>, S extends SubmitCallback<N, F>>(useFormParams: { name: N; initialState?: F | undefined; validators?: V | undefined; onSubmit?: S | undefined; onNotify?: NotifyCallback<F, NotificationType> | undefined<F>; }): UseForm<N, F, V, keyof ReturnType<V>, S>;
```

**Type parameters**

| Name | Constraint                                     |
| ---- | ---------------------------------------------- |
| N    | string                                         |
| F    | [FieldValues][TypeAliasDeclaration-9]          |
| V    | [Validators][TypeAliasDeclaration-10]<F>       |
| S    | [SubmitCallback][TypeAliasDeclaration-0]<N, F> |

**Parameters**

| Name          | Type                                                                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| useFormParams | { name: N; initialState?: F &#124; undefined; validators?: V &#124; undefined; onSubmit?: S &#124; undefined; onNotify?: NotifyCallback<F, NotificationType> &#124; undefined<F>; } |

**Return type**

[UseForm][InterfaceDeclaration-1]<N, F, V, keyof ReturnType<V>, S>

----------

### getForms

Returns an unmutable object
that contains all the forms in the FormContext.

```typescript
function getForms(): Forms<Object>;
```

**Return type**

[Forms][TypeAliasDeclaration-13]<Object>

----------

### FormProvider

Should be declared as high as possible (preferebly in App) in 
the component tree to survive unmounts of the form components.
This way, the form data is saved, even if the user navigates
away from any of the form, as long as the component holding
this provider is not unmounted.

```typescript
function FormProvider<T extends Forms<Object>, N1 extends NotificationHandler<NotificationType>, N2 extends NotificationHandler<SubmitNotificationType>>(props: FormProviderProps<T, N1, N2>): Element;
```

**Type parameters**

| Name | Constraint                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------ |
| T    | [Forms][TypeAliasDeclaration-13]<Object>                                                         |
| N1   | [NotificationHandler][TypeAliasDeclaration-14]<[NotificationType][TypeAliasDeclaration-3]>       |
| N2   | [NotificationHandler][TypeAliasDeclaration-14]<[SubmitNotificationType][TypeAliasDeclaration-1]> |

**Parameters**

| Name  | Type                                                   |
| ----- | ------------------------------------------------------ |
| props | [FormProviderProps][InterfaceDeclaration-4]<T, N1, N2> |

**Return type**

Element

----------

### validate

Validates fields by given validation keys.
Those keys must be present in the provided
`validators`. Returns the errors.

```typescript
function validate<F extends FieldValues, V extends ValidateParams<F>>(validateParams: V): Errors<V["fields"]>;
```

**Type parameters**

| Name | Constraint                                  |
| ---- | ------------------------------------------- |
| F    | [FieldValues][TypeAliasDeclaration-9]       |
| V    | [ValidateParams][InterfaceDeclaration-5]<F> |

**Parameters**

| Name           | Type |
| -------------- | ---- |
| validateParams | V    |

**Return type**

[Errors][TypeAliasDeclaration-11]<V["fields"]>

## Interfaces

### ChangeHandler

```typescript
interface ChangeHandler<F, V> {
    (fields: Partial<F>, validations?: V[] | undefined<V>): void;
    (event: FormEvent<Element>, validations: Array<V>): void;
}
```

**Type parameters**

| Name |
| ---- |
| F    |
| V    |
#### Call

```typescript
(fields: Partial<F>, validations?: V[] | undefined<V>): void;
```

**Parameters**

| Name        | Type                    | Description                                                                                                                                                                    |
| ----------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fields      | Partial<F>              | An object. The property names must correspond
to one of the fields in `initialState`.                                                                                          |
| validations | V[] &#124; undefined<V> | When field values change, they are validated
automatically. By default, only validations with
corresponding names are run, but you can override
which validations to run here. |

**Return type**

void

```typescript
(event: FormEvent<Element>, validations: Array<V>): void;
```

**Parameters**

| Name        | Type               | Description                                                                                                                                                                    |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| event       | FormEvent<Element> | event.target.{name, value, type, checked} are used
to infer the intended change.                                                                                               |
| validations | Array<V>           | When field values change, they are validated
automatically. By default, only validations with
corresponding names are run, but you can override
which validations to run here. |

**Return type**

void


----------

### UseForm

```typescript
interface UseForm<N, F, V, KV, OnSubmitCallback extends (args: any[]) => any> {
    name: N;
    fields: FieldValuesAndErrors<F>;
    hasErrors: boolean;
    handleChange: ChangeHandler<F, KV>;
    handleSubmit: (event?: FormEvent<Element> | undefined) => ReturnType<OnSubmitCallback>;
    loading: boolean;
    inputs: InputPropGenerators<F>;
    validators: V;
}
```

**Type parameters**

| Name             | Constraint           |
| ---------------- | -------------------- |
| N                |                      |
| F                |                      |
| V                |                      |
| KV               |                      |
| OnSubmitCallback | (args: any[]) => any |

**Properties**

| Name         | Type                                                                          | Optional | Description                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name         | N                                                                             | false    | Name of the form                                                                                                                                                                                                                                                                                                                              |
| fields       | [FieldValuesAndErrors][TypeAliasDeclaration-4]<F>                             | false    | An object containing all the fields' values and
if they are valid.                                                                                                                                                                                                                                                                            |
| hasErrors    | boolean                                                                       | false    | `true` if any of the fields contains an error.
To determine the error status of each fields individually,
have a look at the `fields`                                                                                                                                                                                                         |
| handleChange | [ChangeHandler][InterfaceDeclaration-0]<F, KV>                                | false    | Call it to respond to input changes.                                                                                                                                                                                                                                                                                                          |
| handleSubmit | (event?: FormEvent<Element> &#124; undefined) => ReturnType<OnSubmitCallback> | false    | Invokes `onSubmit`. Before that, it runs all field
validations, and if any of them fails, a notification
is emitted with type `validationErrors` and a list of
failed validations.                                                                                                                                                            |
| loading      | boolean                                                                       | false    | Tells if there is some async operation running in the form,
like sending data to server. Can be used to for example disable
the UI while something happens that we should wait for.                                                                                                                                                           |
| inputs       | [InputPropGenerators][TypeAliasDeclaration-5]<F>                              | false    | A convinient way to connect input fields to certain values
in the form.
Instead of using `handleChange` and define
`name`, `id` `type` and `value` attributes individually 
on each input elements,
you can use `inputs` to spread all the necessary props.
([For more, see the docs](https://github.com/balazsorban44/use-form/wiki#inputs)) |
| validators   | V                                                                             | false    |                                                                                                                                                                                                                                                                                                                                               |

----------

### FormProviderProps

```typescript
interface FormProviderProps<T, N1, N2> {
    children: ReactElement<any, string | (props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> ... | new (props: any) => Component<any, any, any>>;
    initialState: T;
    validators?: AllValidators<T> | undefined<T>;
    onSubmit?: SubmitFunction<T, N2, Form<T>, keyof T> | undefined<T, N2, Form<T>, keyof T>;
    onNotify?: N1 | undefined;
}
```

**Type parameters**

| Name |
| ---- |
| T    |
| N1   |
| N2   |

**Properties**

| Name         | Type                                                                                                                                                                                                | Optional | Description                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| children     | ReactElement<any, string &#124; (props: any) => ReactElement<any, string &#124; any &#124; (new (props: any) => Component<any, any, any>)> ... &#124; new (props: any) => Component<any, any, any>> | false    | You can utilize useForm anywhere from this element down the tree.       |
| initialState | T                                                                                                                                                                                                   | false    | Give the initial state of the forms.                                    |
| validators   | AllValidators<T> &#124; undefined<T>                                                                                                                                                                | true     | The validators for the forms. Mirrors the structure of `initialState`.  |
| onSubmit     | SubmitFunction<T, N2, Form<T>, keyof T> &#124; undefined<T, N2, [Form][TypeAliasDeclaration-12]<T>, keyof T>                                                                                        | true     |                                                                         |
| onNotify     | N1 &#124; undefined                                                                                                                                                                                 | true     |                                                                         |

----------

### FieldValueAndError

```typescript
interface FieldValueAndError<V> {
    value: V;
    error?: boolean | undefined;
}
```

**Type parameters**

| Name |
| ---- |
| V    |

**Properties**

| Name  | Type                     | Optional | Description                           |
| ----- | ------------------------ | -------- | ------------------------------------- |
| value | V                        | false    | The field's value.                    |
| error | boolean &#124; undefined | true     | `true` if the field value is invalid. |

----------

### GeneratedProps

```typescript
interface GeneratedProps<T, F, N extends keyof F> {
    id: N;
    name: N;
    value: F[N];
    type: T extends "datetimeLocal" ? "datetime-local" : T;
    onChange: bivarianceHack;
}
```

**Type parameters**

| Name | Constraint |
| ---- | ---------- |
| T    |            |
| F    |            |
| N    | keyof F    |

**Properties**

| Name     | Type                                             | Optional |
| -------- | ------------------------------------------------ | -------- |
| id       | N                                                | false    |
| name     | N                                                | false    |
| value    | F[N]                                             | false    |
| type     | T extends "datetimeLocal" ? "datetime-local" : T | false    |
| onChange | bivarianceHack                                   | false    |

----------

### ValidateParams

```typescript
interface ValidateParams<F> {
    fields: Partial<F>;
    validators: Validators<F>;
    validations?: string[];
    form?: F | undefined;
    submitting?: Boolean | undefined;
}
```

**Type parameters**

| Name |
| ---- |
| F    |

**Properties**

| Name        | Type                                     | Optional |
| ----------- | ---------------------------------------- | -------- |
| fields      | Partial<F>                               | false    |
| validators  | [Validators][TypeAliasDeclaration-10]<F> | false    |
| validations | string[]                                 | true     |
| form        | F &#124; undefined                       | true     |
| submitting  | Boolean &#124; undefined                 | true     |

## Types

### SubmitCallback

```typescript
type SubmitCallback<N, F, T = any> = (submitParams: { name?: N | undefined; fields: F; setLoading: Dispatch<SetStateAction<boolean>>; notify: NotifyCallback<F, SubmitNotificationType>; }) => T;
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| N    |         |
| F    |         |
| T    | any     |

**Type**

(submitParams: { name?: N | undefined; fields: F; setLoading: Dispatch<SetStateAction<boolean>>; notify: NotifyCallback<F, SubmitNotificationType>; }) => T

----------

### Form

```typescript
type Form<T> = {
    [K extends keyof T]: any
};
```

**Type parameters**

| Name |
| ---- |
| T    |

**Type**

{ [K extends keyof T]: any }

----------

### Forms

```typescript
type Forms<T> = {
    [K extends keyof T]: Form<T[K]>
};
```

**Type parameters**

| Name |
| ---- |
| T    |

**Type**

{ [K extends keyof T]: [Form][TypeAliasDeclaration-12]<T[K]> }

----------

### NotificationHandler

```typescript
type NotificationHandler<T> = (type: T) => void;
```

**Type parameters**

| Name |
| ---- |
| T    |

**Type**

(type: T) => void

----------

### FieldValues

```typescript
type FieldValues<F = {}> = {
    [K extends keyof F]: F[K]
};
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| F    | {}      |

**Type**

{ [K extends keyof F]: F[K] }

----------

### FieldValuesAndErrors

```typescript
type FieldValuesAndErrors<F = {}> = {
    [K extends keyof F]: FieldValueAndError<F[K]>
};
```

**Type parameters**

| Name | Default |
| ---- | ------- |
| F    | {}      |

**Type**

{ [K extends keyof F]: [FieldValueAndError][InterfaceDeclaration-2]<F[K]> }

----------

### InputTypes

```typescript
type InputTypes = "text" | "radio" | "email" | "password" | "search" | "color" | "tel" | "url" | "submit" | "date" | "time" | "week" | "month" | "datetimeLocal" | "number" | "range" | "checkbox" | "select";
```

**Type**

"text" | "radio" | "email" | "password" | "search" | "color" | "tel" | "url" | "submit" | "date" | "time" | "week" | "month" | "datetimeLocal" | "number" | "range" | "checkbox" | "select"

----------

### GenericObject

```typescript
type GenericObject = {
    [key: string]: any;
};
```

**Type**

{ [key: string]: any; }

----------

### GeneratePropsFunc

```typescript
type GeneratePropsFunc<T, F, N extends keyof F, R, P = { name: N; value: F[N]; error: boolean; }> = (props: P) => P & R;
```

**Type parameters**

| Name | Constraint | Default                                   |
| ---- | ---------- | ----------------------------------------- |
| T    |            |                                           |
| F    |            |                                           |
| N    | keyof F    |                                           |
| R    |            |                                           |
| P    |            | { name: N; value: F[N]; error: boolean; } |

**Type**

(props: P) => P & R

----------

### InputPropGenerator

```typescript
type InputPropGenerator<T, F, N extends keyof F, G extends (args: any[]) => any = GeneratePropsFunc<T, F, N, {}>> = (name: N, options?: { value: T extends "checkbox" | "select" ? string : never; generateProps: G; } | undefined) => GeneratedProps<T, F, N> | ReturnType<G>;
```

**Type parameters**

| Name | Constraint           | Default                                                  |
| ---- | -------------------- | -------------------------------------------------------- |
| T    |                      |                                                          |
| F    |                      |                                                          |
| N    | keyof F              |                                                          |
| G    | (args: any[]) => any | [GeneratePropsFunc][TypeAliasDeclaration-8]<T, F, N, {}> |

**Type**

(name: N, options?: { value: T extends "checkbox" | "select" ? string : never; generateProps: G; } | undefined) => [GeneratedProps][InterfaceDeclaration-3]<T, F, N> | ReturnType<G>

----------

### InputPropGenerators

```typescript
type InputPropGenerators<F> = {
    [K extends InputTypes]: InputPropGenerator<K, F, keyof F>
};
```

**Type parameters**

| Name |
| ---- |
| F    |

**Type**

{ [K extends [InputTypes][TypeAliasDeclaration-6]]: [InputPropGenerator][TypeAliasDeclaration-7]<K, F, keyof F> }

----------

### SubmitError

```typescript
type SubmitError = "submitError";
```

**Type**

"submitError"

----------

### ValidationErrors

```typescript
type ValidationErrors = "validationErrors";
```

**Type**

"validationErrors"

----------

### SubmitNotificationType

```typescript
type SubmitNotificationType = "submitError" | "submitSuccess";
```

**Type**

"submitError" | "submitSuccess"

----------

### NotificationType

```typescript
type NotificationType = "validationErrors" | SubmitNotificationType;
```

**Type**

"validationErrors" | [SubmitNotificationType][TypeAliasDeclaration-1]

----------

### Reason

```typescript
type Reason<S, F> = Reason<S, F>;
```

**Type parameters**

| Name |
| ---- |
| S    |
| F    |

**Type**

Reason<S, F>

----------

### NotifyCallback

```typescript
type NotifyCallback<F, S extends NotificationType = NotificationType> = (type: S, reason?: Reason<S, F> | undefined<S, F>) => void;
```

**Type parameters**

| Name | Constraint                                 | Default                                    |
| ---- | ------------------------------------------ | ------------------------------------------ |
| F    |                                            |                                            |
| S    | [NotificationType][TypeAliasDeclaration-3] | [NotificationType][TypeAliasDeclaration-3] |

**Type**

(type: S, reason?: Reason<S, F> | undefined<S, F>) => void

----------

### Errors

```typescript
type Errors<T> = {
    [K extends keyof T]: boolean
};
```

**Type parameters**

| Name |
| ---- |
| T    |

**Type**

{ [K extends keyof T]: boolean }

----------

### Validators

```typescript
type Validators<T> = (fields: T, submitting: boolean) => Errors<T>;
```

**Type parameters**

| Name |
| ---- |
| T    |

**Type**

(fields: T, submitting: boolean) => [Errors][TypeAliasDeclaration-11]<T>

## Variables

### default

Context that holds the forms 

```typescript
var default: {}<any>;
```

**Type**

{}<any>

[SourceFile-0]: index.d.md#indexdts
[FunctionDeclaration-0]: index.d.md#useform
[TypeAliasDeclaration-9]: index.d.md#fieldvalues
[TypeAliasDeclaration-10]: index.d.md#validators
[TypeAliasDeclaration-0]: index.d.md#submitcallback
[InterfaceDeclaration-1]: index.d.md#useform
[FunctionDeclaration-1]: index.d.md#getforms
[TypeAliasDeclaration-13]: index.d.md#forms
[FunctionDeclaration-2]: index.d.md#formprovider
[TypeAliasDeclaration-13]: index.d.md#forms
[TypeAliasDeclaration-3]: index.d.md#notificationtype
[TypeAliasDeclaration-14]: index.d.md#notificationhandler
[TypeAliasDeclaration-1]: index.d.md#submitnotificationtype
[TypeAliasDeclaration-14]: index.d.md#notificationhandler
[InterfaceDeclaration-4]: index.d.md#formproviderprops
[FunctionDeclaration-3]: index.d.md#validate
[TypeAliasDeclaration-9]: index.d.md#fieldvalues
[InterfaceDeclaration-5]: index.d.md#validateparams
[TypeAliasDeclaration-11]: index.d.md#errors
[InterfaceDeclaration-0]: index.d.md#changehandler
[InterfaceDeclaration-1]: index.d.md#useform
[TypeAliasDeclaration-4]: index.d.md#fieldvaluesanderrors
[InterfaceDeclaration-0]: index.d.md#changehandler
[TypeAliasDeclaration-5]: index.d.md#inputpropgenerators
[InterfaceDeclaration-4]: index.d.md#formproviderprops
[TypeAliasDeclaration-12]: index.d.md#form
[InterfaceDeclaration-2]: index.d.md#fieldvalueanderror
[InterfaceDeclaration-3]: index.d.md#generatedprops
[InterfaceDeclaration-5]: index.d.md#validateparams
[TypeAliasDeclaration-10]: index.d.md#validators
[TypeAliasDeclaration-0]: index.d.md#submitcallback
[TypeAliasDeclaration-12]: index.d.md#form
[TypeAliasDeclaration-13]: index.d.md#forms
[TypeAliasDeclaration-12]: index.d.md#form
[TypeAliasDeclaration-14]: index.d.md#notificationhandler
[TypeAliasDeclaration-9]: index.d.md#fieldvalues
[TypeAliasDeclaration-4]: index.d.md#fieldvaluesanderrors
[InterfaceDeclaration-2]: index.d.md#fieldvalueanderror
[TypeAliasDeclaration-6]: index.d.md#inputtypes
[TypeAliasDeclaration-15]: index.d.md#genericobject
[TypeAliasDeclaration-8]: index.d.md#generatepropsfunc
[TypeAliasDeclaration-7]: index.d.md#inputpropgenerator
[TypeAliasDeclaration-8]: index.d.md#generatepropsfunc
[InterfaceDeclaration-3]: index.d.md#generatedprops
[TypeAliasDeclaration-5]: index.d.md#inputpropgenerators
[TypeAliasDeclaration-6]: index.d.md#inputtypes
[TypeAliasDeclaration-7]: index.d.md#inputpropgenerator
[TypeAliasDeclaration-16]: index.d.md#submiterror
[TypeAliasDeclaration-17]: index.d.md#validationerrors
[TypeAliasDeclaration-1]: index.d.md#submitnotificationtype
[TypeAliasDeclaration-3]: index.d.md#notificationtype
[TypeAliasDeclaration-1]: index.d.md#submitnotificationtype
[TypeAliasDeclaration-18]: index.d.md#reason
[TypeAliasDeclaration-2]: index.d.md#notifycallback
[TypeAliasDeclaration-3]: index.d.md#notificationtype
[TypeAliasDeclaration-3]: index.d.md#notificationtype
[TypeAliasDeclaration-11]: index.d.md#errors
[TypeAliasDeclaration-10]: index.d.md#validators
[TypeAliasDeclaration-11]: index.d.md#errors
[VariableDeclaration-0]: index.d.md#default