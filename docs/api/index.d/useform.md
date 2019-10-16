# default

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
| fields       | FieldValuesAndErrors<F>                             | false    | An object containing all the fields' values and
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
| inputs       | InputPropGenerators<F>                              | false    | A convinient way to connect input fields to certain values
in the form.
Instead of using `handleChange` and define
`name`, `id` `type` and `value` attributes individually 
on each input elements,
you can use `inputs` to spread all the necessary props.
([For more, see the docs](https://github.com/balazsorban44/use-form/wiki#inputs)) |
| validators   | V                                                                             | false    |                                                                                                                                                                                                                                                                                                                                               |

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

[NamespaceImport-0]: useform.md#default
[InterfaceDeclaration-0]: useform.md#changehandler
[InterfaceDeclaration-1]: useform.md#useform
[InterfaceDeclaration-0]: useform.md#changehandler
[TypeAliasDeclaration-0]: useform.md#submitcallback