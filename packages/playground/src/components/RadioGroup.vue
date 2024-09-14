<script setup lang="ts">
import { type RadioGroupProps, useRadioGroup } from '@formwerk/core';

const props = defineProps<RadioGroupProps>();

const { groupProps, labelProps, descriptionProps, errorMessageProps, errorMessage, fieldValue } = useRadioGroup(props);
</script>

<template>
  <div v-bind="groupProps" class="radio-group">
    <div v-bind="labelProps" class="group-label">{{ label }} {{ fieldValue }}</div>

    <div class="radios-container">
      <slot />
    </div>

    <div v-if="errorMessage" v-bind="errorMessageProps" class="error">
      {{ errorMessage }}
    </div>

    <div v-else-if="description" v-bind="descriptionProps" class="hint">
      {{ description }}
    </div>
  </div>
</template>

<style>
:root {
  --color-text: #333;
  --color-hint: #666;
  --color-border: #ccc;
  --color-focus: #007bff;
  --color-error: #f00;
  --color-valid: #059669;
  --color-hover: #eee;
}
</style>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;

  .hint,
  .error {
    margin-top: 0.25rem;
  }

  .error {
    color: var(--color-error);
    display: none;
    font-size: 13px;
  }

  .hint {
    color: var(--color-hint);
    font-size: 13px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .radios-container {
    margin-top: 0.25rem;
  }

  .group-label {
    color: var(--color-text);
    display: block;
    margin-bottom: 0.25rem;
    font-size: 14px;
    font-weight: 500;
  }

  &:has(:focus) {
    .hint {
      opacity: 1;
    }
  }

  &:has(:invalid) {
    .error {
      display: block;
    }

    .hint {
      display: none;
    }
  }
}
</style>
