<script setup lang="ts">
import DateField from '@/components/DateField.vue';

const min = new Date(2025, 0, 4, 0, 0, 0, 0);
const value = new Date('2025-01-15');
const max = new Date('2025-01-20');
</script>

<template>
  <DateField name="birthdate" label="Birth Date" :value="value" :min="min" :max="max" />
</template>
