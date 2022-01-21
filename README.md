# coproduct

A small library improve better tagged-union supporting for TypeScript

## Installation

```shell
yarn add coproduct
npm install --save coproduct
```

## Usage

Basic usage

```typescript
import { Tagged, TaggedData, match } from 'coproduct';

export type Option<T> = TaggedData<'some', T> | Tagged<'none'>;

export const None = Tagged('none');
export const Some = TaggedData('some');

const show = <T>(data: Option<T>) => {
  return match(data).case({
    some: value => `some: ${value}`,
    none: () => 'none',
  });
};

expect(show(Some(1))).toBe('some: 1');
expect(show(None)).toBe('none');
```

You don't need to define your own `option type`, coproduct has built-in `Option` and `Result`.

```typescript
import { match, Option, Some, None, Result, Ok, Err } from 'coproduct';

const show = <T>(data: Option<T>) => {
  return match(data).case({
    some: value => `some: ${value}`,
    none: () => 'none',
  });
};

expect(show(Some(1))).toBe('some: 1');
expect(show(None)).toBe('none');

const showResult = <T>(result: Result<T>) => {
  return match(result).case({
    ok: value => `ok: ${value}`,
    err: value => `err: ${value}`,
  });
};

expect(showResult(Ok(1))).toBe('ok: 1');
expect(showResult(Err('error'))).toBe('err: error');
```

## Api

### Tagged(string)

`Tagged(tag)` return a tagged object with `{ tag: tag }` structure. It's useful for nullary case.

### TaggedData(string)

`TaggedData(tag)` return a factory function with `(data: T) => TaggedData<tag, T>` signature. It's useful for the case that carried data

### match(data).case(patterns)

`match(data).case(patterns)` perform `exhaustive pattern-matching` for data, every case in `data` should has its own visitor function.

### match(data).partial(patterns)

`match(data).partial(patterns)` perform `non-exhaustive pattern-matching` for data.

### Some(value)

`Some(value)` return the value with the `Some<T>` case of `Option Type`.

### None

`None` is the value with the `None` case of `Option Type`

### Ok(value)

`OK(value)` return the value with the `OK<T>` case of `Result Type`.

### Err(message)

`Err(message)` return the value with the `Err<E>` case of `Result Type`.
