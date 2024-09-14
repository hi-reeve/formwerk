<script setup lang="ts">
import { type RadioProps, useRadio } from '@formwerk/core';

const props = defineProps<RadioProps>();

const { labelProps, inputProps } = useRadio(props);
</script>

<template>
  <div class="radio-item">
    <label v-bind="labelProps">
      <input v-bind="inputProps" class="sr-only" />

      {{ label }}
    </label>
  </div>
</template>

<style>
:root {
  --color-text: #333;
  --color-hint: #666;
  --color-border: #ccc;
  --color-focus: #0056b3;
  --color-error: #f00;
  --color-valid: #059669;
  --color-hover: #eee;
}
</style>

<style scoped>
.radio-item {
  display: inline-flex;
  align-items: center;
  border-radius: 99999px;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 500;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:has(:focus) {
    border: 1px solid var(--color-focus);
  }

  &:has(:checked) {
    background-color: var(--color-focus);
    color: #fff;
  }
}

/** This is a common utility CSS class, you can find it in your CSS framework of choice */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
