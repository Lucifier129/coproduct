type UnionToIntersection<T> = (T extends any
? (x: T) => any
: never) extends (x: infer R) => any
  ? R
  : never;

export type Tagged<Tag extends string> = {
  tag: Tag;
};

type Field<Key extends string, Value> = {
  [key in Key]: Value;
};

type WithData<Tag extends string, Data> = Tagged<Tag> & Field<Tag, Data>;

export type TaggedData<Tag extends string, Data> = {
  [key in keyof WithData<Tag, Data>]: WithData<Tag, Data>[key];
};

type Visitor<T, R> = T extends Tagged<string>
  ? keyof T extends 'tag'
    ? {
        [key in T['tag']]: () => R;
      }
    : T extends {
        [key in T['tag']]: infer Data;
      }
    ? {
        [key in T['tag']]: (data: Data) => R;
      }
    : never
  : never;

type Visitors<T extends Tagged<string>, R> = UnionToIntersection<Visitor<T, R>>;

interface Matcher<T extends Tagged<string>> {
  case<R>(
    patterns: {
      [key in keyof Visitors<T, R>]: Visitors<T, R>[key];
    }
  ): R;
  case<R>(
    patterns: Partial<
      {
        [key in keyof Visitors<T, R>]: Visitors<T, R>[key];
      }
    > & {
      _: () => R;
    }
  ): R;
  partial<R>(
    patterns: Partial<
      {
        [key in keyof Visitors<T, R>]: Visitors<T, R>[key];
      }
    > & {
      _?: () => R;
    }
  ): R;
}

export const match = <T extends Tagged<string>>(data: T): Matcher<T> => {
  return {
    case(patterns: object) {
      if (data.tag in patterns) {
        // @ts-expect-error
        return patterns[data.tag](data[data.tag]);
      }
      if ('_' in patterns) {
        // @ts-expect-error
        return patterns._();
      }
      throw new Error(`Unexpected input: ${data}`);
    },
    partial(patterns: object) {
      if (data.tag in patterns) {
        // @ts-expect-error
        return patterns[data.tag](data[data.tag]);
      }
      if ('_' in patterns) {
        // @ts-expect-error
        return patterns._!();
      }
      throw new Error(`Unhandled branch: ${data.tag}`);
    },
  };
};

export const Tagged = <Tag extends string>(tag: Tag): Tagged<Tag> => {
  return {
    tag,
  };
};

export const TaggedData = <Tag extends string>(tag: Tag) => {
  return <Data>(data: Data) => {
    return {
      tag,
      [tag]: data,
    } as TaggedData<Tag, Data>;
  };
};

export type Some<T> = TaggedData<'some', T>;
export type None = Tagged<'none'>;
export type Option<T> = Some<T> | None;

export const None = Tagged('none');
export const Some = TaggedData('some');

export type Ok<T> = TaggedData<'ok', T>;
export type Err<E = string> = TaggedData<'err', E>;
export type Result<T, E = string> = Ok<T> | Err<E>;

export const Err = TaggedData('err');
export const Ok = TaggedData('ok');
