export type Errors<T> = {[K in keyof T]: boolean}

export type Validators<T> = (fields: T, submitting: boolean) => Errors<T>