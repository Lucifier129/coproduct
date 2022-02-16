type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never

type Tagged<Tag extends string, TagField extends string> = {
  [key in TagField]: Tag
}

type DefaultTagFiled = 'type'

type Visitor<T, R, TagFiled extends string = DefaultTagFiled> = T extends Tagged<infer Tag, TagFiled>
  ? {
      [key in Tag]: (value: T) => R
    }
  : never

type Visitors<T extends Tagged<string, TagFiled>, R, TagFiled extends string = DefaultTagFiled> = UnionToIntersection<
  Visitor<T, R, TagFiled>
>

interface Matcher<T extends Tagged<string, TagFiled>, TagFiled extends string = DefaultTagFiled> {
  case<R>(patterns: {
    [key in keyof Visitors<T, R, TagFiled>]: Visitors<T, R, TagFiled>[key]
  }): R
  case<R>(
    patterns: Partial<{
      [key in keyof Visitors<T, R, TagFiled>]: Visitors<T, R, TagFiled>[key]
    }> & {
      _: (value: T) => R
    },
  ): R
}

export const createMatch = <TagField extends string>(tagFiled: TagField) => {
  return <T extends Tagged<string, TagField>>(data: T): Matcher<T, TagField> => {
    return {
      case(patterns: object) {
        const tag = data[tagFiled]

        if (tag in patterns) {
          // @ts-ignore - this is a valid case
          return patterns[tag](data)
        }

        if ('_' in patterns) {
          // @ts-ignore - this is a valid case
          return patterns._(data)
        }

        throw new Error(`Unexpected input: ${data}`)
      },
    }
  }
}

export const match = createMatch('type')

export type Some<T> = {
  type: 'Some'
  value: T
}

export type None = {
  type: 'None'
}

export type Option<T> = Some<T> | None

export const None: None = {
  type: 'None',
}

export const Some = <T>(value: T): Some<T> => ({
  type: 'Some',
  value,
})

export type Ok<T> = {
  type: 'Ok'
  value: T
}

export type Err<E = string> = {
  type: 'Err'
  info: E
}

export type Result<T, E = string> = Ok<T> | Err<E>

export const Err = <E = string>(info: E): Err<E> => ({
  type: 'Err',
  info,
})

export const Ok = <T>(value: T): Ok<T> => ({
  type: 'Ok',
  value,
})
