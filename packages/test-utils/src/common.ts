import { v1 } from '@standard-schema/spec';

export function defineStandardSchema<TInput, TOutput = TInput>(
  validate: v1.StandardSchema<TInput, TOutput>['~standard']['validate'],
) {
  const schema: v1.StandardSchema<TInput, TOutput> = {
    '~standard': {
      vendor: 'custom',
      validate,
      version: 1,
    },
  };

  return schema;
}
