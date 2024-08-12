<template>
  <div class="flex flex-col">
    <InputText label="deep" name="some.deep.path" />
    <InputText label="arr" name="some.array.0.path" />

    <span data-testid="e2">{{ getError('some.array.0.path') }}</span>

    <pre>{{ getErrors() }}</pre>
  </div>
</template>

<script lang="ts" setup>
import InputText from '@/components/InputText.vue';
import { useForm } from '@formwerk/core';
import { defineSchema } from '@formwerk/schema-zod';
import { z } from 'zod';

const { getError, isValid, getErrors } = useForm({
  schema: defineSchema(
    z.object({
      some: z.object({
        deep: z.object({
          path: z.string().min(1, 'REQUIRED'),
        }),
        array: z.array(
          z.object({
            path: z.string().min(1, 'REQUIRED'),
          }),
        ),
      }),
    }),
  ),
});
</script>
