<script setup lang="ts">
import Checkbox from '@/components/CheckboxInput.vue';
import CheckboxGroup from '@/components/CheckboxGroup.vue';
import { z } from 'zod';
import { defineSchema } from '@formwerk/schema-zod';

const schema = defineSchema(
  z.array(z.string()).min(1, 'Please select a drink').max(2, 'You can only select up to 2 drinks'),
);
</script>

<template>
  <CheckboxGroup label="Select a drink" description="Select up to 2 drinks" :schema="schema">
    <Checkbox label="Tea 🍵" value="🍵" />
    <Checkbox label="Coffee ☕️" value="☕️" />
    <Checkbox label="Milk 🥛" value="🥛" />
  </CheckboxGroup>
</template>
