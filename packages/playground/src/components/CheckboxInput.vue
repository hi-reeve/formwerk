<script setup lang="ts">
import { type CheckboxProps, useCheckbox } from '@formwerk/core';

const props = defineProps<CheckboxProps>();

const { labelProps, inputProps, errorMessage, errorMessageProps } = useCheckbox(props);
</script>

<template>
  <div class="checkbox-item">
    <label v-bind="labelProps">
      <div class="control">
        <input v-bind="inputProps" class="sr-only" />
      </div>

      {{ label }}
    </label>

    <div v-if="errorMessage" v-bind="errorMessageProps">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.checkbox-item {
  --color-text: #333;
  --color-hint: #666;
  --color-border: #ccc;
  --color-focus: #0056b3;
  --color-error: #f00;
  --color-valid: #059669;
  --color-hover: #eee;

  label {
    display: inline-flex;
    width: max-content;
    align-items: center;
    border-radius: 99999px;
    padding: 0.5rem 1rem;
    user-select: none;
    border: 1px solid var(--color-border);
    font-size: 13px;
    cursor: pointer;
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

    &:has(:disabled) {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--color-border);
    }
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
