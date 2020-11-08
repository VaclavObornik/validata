import { isString as isStringOriginal, maybeAsString as maybeAsStringOriginal } from './string';
import {ValueProcessor} from './types';

type GetProcessorType<C extends ValueProcessor<any>> = C extends ValueProcessor<infer T> ? T : unknown;

const wrap = <
  TV,
  TF extends (...args: any[]) => ValueProcessor<TV>,
>(validator: TF) => {


  return <Options extends Parameters<TF>[0]>(value: unknown, options: Options) => {
    const result = validator(options).process(value);
    if ('issues' in result) {
      throw new Error(result.issues[0].reason);
    }

    type ResultType = GetProcessorType<ReturnType<TF>>;
    type FinalType = Options extends { default: NonNullable<TV> }
      ? NonNullable<ResultType>
      : ResultType;

    return result.value as FinalType;
  };
};

const result = isStringOriginal({ minLength: 1 }).process('aaa');
if (!('issues' in result)) {
  const value: string = result.value;
  console.log(value);
}

export const isString = wrap(isStringOriginal);
const result1 = isString('asdsdf', {minLength: 1, regex: /a/});
result1.toLowerCase();


const resOrig = isStringOriginal({}).process('sdfsdf');
if ('value' in resOrig) {
  resOrig.value.toLowerCase();
}


export const maybeAsString = wrap(maybeAsStringOriginal);
const result2 = maybeAsString('asdsdf', { default: undefined }).toLowerCase();


const fff = maybeAsStringOriginal({ default: 'Xxx' }).process('aaa');
if ('value' in fff) {
  fff.value.toLocaleLowerCase();
}

