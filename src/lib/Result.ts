export type Result<T, E extends Error> = Success<T> | Failure<E>

export class Success<T> {
  readonly value: T

  constructor(value: T) {
    this.value = value
  }

  isSuccess(): this is Success<T> {
    return true
  }

  isFailure(): this is Failure<Error> {
    return false
  }
}

export class Failure<E extends Error> {
  readonly error: E

  constructor(error: E) {
    this.error = error
  }

  isSuccess(): this is Success<unknown> {
    return false
  }

  isFailure(): this is Failure<E> {
    return true
  }
}
