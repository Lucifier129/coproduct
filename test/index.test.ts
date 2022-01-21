import { Err, match, Ok, Result, Option, Tagged, TaggedData, Some, None } from '../src';

describe('coproduct', () => {
  it('works', () => {
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
    }

    expect(showResult(Ok(1))).toBe('ok: 1');
    expect(showResult(Err('error'))).toBe('err: error');

    type Test =
      | TaggedData<'a', number>
      | TaggedData<'b', string>
      | TaggedData<'c', boolean>
      | TaggedData<'d', number[]>;

    const A = TaggedData('a');
    const B = TaggedData('b');
    const C = TaggedData('c');
    const D = TaggedData('d');

    const showTest = (data: Test) => {
      return match(data).case({
        a: value => `a: ${value}`,
        b: value => `b: ${value}`,
        c: value => `c: ${value}`,
        d: value => `d: ${value.join(' & ')}`,
      });
    };

    const test4: Test = A(1);
    const test5: Test = B('a');
    const test6: Test = C(true);
    const test7: Test = D([1, 2, 3]);
    const test8 = showTest(test4);
    const test9 = showTest(test5);
    const test10 = showTest(test6);
    const test11 = showTest(test7);

    expect(test8).toBe('a: 1');
    expect(test9).toBe('b: a');
    expect(test10).toBe('c: true');
    expect(test11).toBe('d: 1 & 2 & 3');


    type CounterState = {
      count: number;
    };

    type CounterAction =
      | Tagged<'incre'>
      | Tagged<'decre'>
      | TaggedData<'increBy', number>
      | TaggedData<'decreBy', number>;

    const counterReducer = (
      state: CounterState,
      action: CounterAction
    ): CounterState => {
      if (action.tag === 'incre') {
        return {
          ...state,
          count: state.count + 1,
        };
      } else if (action.tag === 'decre') {
        return {
          ...state,
          count: state.count - 1,
        };
      } else if (action.tag === 'increBy') {
        return {
          ...state,
          count: state.count + action.increBy,
        };
      } else if (action.tag === 'decreBy') {
        return {
          ...state,
          count: state.count - action.decreBy,
        };
      }

      throw new Error(`Unexpected action: ${action}`);
    };

    const Incre = Tagged('incre');
    const Decre = Tagged('decre');
    const IncreBy = TaggedData('increBy');
    const DecreBy = TaggedData('decreBy');

    const counterState0: CounterState = {
      count: 0,
    };

    const counterState1 = counterReducer(counterState0, Incre);
    const counterState2 = counterReducer(counterState1, Decre);
    const counterState3 = counterReducer(counterState2, IncreBy(2));
    const counterState4 = counterReducer(counterState3, DecreBy(3));

    expect(counterState1.count).toBe(1);
    expect(counterState2.count).toBe(0);
    expect(counterState3.count).toBe(2);
    expect(counterState4.count).toBe(-1);
  });
});
