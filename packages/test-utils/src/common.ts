import { StandardSchemaV1 } from '@standard-schema/spec';

export function defineStandardSchema<TInput, TOutput = TInput>(
  validate: StandardSchemaV1<TInput, TOutput>['~standard']['validate'],
) {
  const schema: StandardSchemaV1<TInput, TOutput> = {
    '~standard': {
      vendor: 'custom',
      validate,
      version: 1,
    },
  };

  return schema;
}
