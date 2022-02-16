import { Err, match, Ok, Result, Option, Some, None } from '../src';

describe('coproduct', () => {
  it('support exhaustive pattern-matching', () => {
    const show = <T>(data: Option<T>) => {
      return match(data).case({
        Some: data => `some: ${data.value}`,
        None: () => 'none',
      });
    };

    expect(show(Some(1))).toBe('some: 1');
    expect(show(None)).toBe('none');

    const showResult = <T>(result: Result<T>) => {
      return match(result).case({
        Ok: data => `ok: ${data.value}`,
        Err: error => `err: ${error.info}`,
      });
    };

    expect(showResult(Ok(1))).toBe('ok: 1');
    expect(showResult(Err('error'))).toBe('err: error');

    type Test =
      | {
          type: 'a';
          a: number;
        }
      | {
          type: 'b';
          b: string;
        }
      | {
          type: 'c';
          c: boolean;
        }
      | {
          type: 'd';
          d: number[];
        };

    const showTest = (data: Test) => {
      return match(data).case({
        a: data => `a: ${data.a}`,
        b: data => `b: ${data.b}`,
        c: data => `c: ${data.c}`,
        d: data => `d: ${data.d.join(' & ')}`,
      });
    };

    const test4: Test = {
      type: 'a',
      a: 1,
    };
    const test5: Test = {
      type: 'b',
      b: 'b',
    };
    const test6: Test = {
      type: 'c',
      c: true,
    };
    const test7: Test = {
      type: 'd',
      d: [1, 2, 3],
    };
    
    const test8 = showTest(test4);
    const test9 = showTest(test5);
    const test10 = showTest(test6);
    const test11 = showTest(test7);

    expect(test8).toBe('a: 1');
    expect(test9).toBe('b: b');
    expect(test10).toBe('c: true');
    expect(test11).toBe('d: 1 & 2 & 3');

    type CounterState = {
      count: number;
    };

    type CounterAction =
      | {
          type: 'incre';
        }
      | {
          type: 'decre';
        }
      | {
          type: 'increBy';
          step: number;
        }
      | {
          type: 'decreBy';
          step: number;
        };

    const counterReducer = (
      state: CounterState,
      action: CounterAction
    ): CounterState => {
      if (action.type === 'incre') {
        return {
          ...state,
          count: state.count + 1,
        };
      } else if (action.type === 'decre') {
        return {
          ...state,
          count: state.count - 1,
        };
      } else if (action.type === 'increBy') {
        return {
          ...state,
          count: state.count + action.step,
        };
      } else if (action.type === 'decreBy') {
        return {
          ...state,
          count: state.count - action.step,
        };
      }

      throw new Error(`Unexpected action: ${action}`);
    };

    const Incre: CounterAction = {
      type: 'incre',
    };

    const Decre: CounterAction = {
      type: 'decre',
    };
    const counterState0: CounterState = {
      count: 0,
    };

    const counterState1 = counterReducer(counterState0, Incre);
    const counterState2 = counterReducer(counterState1, Decre);
    const counterState3 = counterReducer(counterState2, {
      type: 'increBy',
      step: 2,
    });
    const counterState4 = counterReducer(counterState3, {
      type: 'decreBy',
      step: 3,
    });

    expect(counterState1.count).toBe(1);
    expect(counterState2.count).toBe(0);
    expect(counterState3.count).toBe(2);
    expect(counterState4.count).toBe(-1);
  });

  it('supports default handler', () => {
    const result0 = match(None as Option<number>).case({
      _: () => 0,
    });
    const result1 = match(Some(1) as Option<number>).case({
      None: () => 2,
      _: () => 1,
    });

    expect(result0).toBe(0);
    expect(result1).toBe(1);
  });
});
