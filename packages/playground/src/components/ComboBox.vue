<script setup lang="ts" generic="TOption extends { label: string; value: string }, TValue">
import { useId } from 'vue';
import { useComboBox, ComboBoxProps, useDefaultFilter } from '@formwerk/core';
import Option from './OptionItem.vue';

interface Props extends ComboBoxProps<TOption, TValue> {
  options?: TOption[];
}

const props = defineProps<Props>();

const anchorId = `--${useId()}`;

const { contains } = useDefaultFilter({
  caseSensitive: false,
});

const {
  inputProps,
  listBoxProps,
  labelProps,
  buttonProps,
  errorMessageProps,
  errorMessage,
  descriptionProps,
  isListEmpty,
} = useComboBox(props, {
  filter: contains,
});
</script>

<template>
  <div class="select-field">
    <label v-bind="labelProps">{{ label }}</label>

    <div class="inline-flex items-center gap-2 trigger">
      <input v-bind="inputProps" type="text" />

      <button v-bind="buttonProps">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
          <path
            d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
          ></path>
        </svg>
      </button>
    </div>

    <div v-bind="listBoxProps" popover>
      <slot>
        <Option v-for="option in options" :key="option.label" :label="option.label" :value="option" />
      </slot>

      <div v-if="isListEmpty" class="text-white text-gray-400">No options found</div>
    </div>

    <p class="hint" :class="{ 'is-error': !!errorMessage }">{{ errorMessage || description }}</p>
  </div>
</template>

<style scoped>
label {
  @apply block mb-1 w-full font-semibold text-lg text-white;
}

.trigger {
  @apply max-w-xs pr-4 rounded-md border-2 border-transparent w-full bg-zinc-800 focus-within:bg-zinc-900 focus-within:outline-none transition-colors duration-200 focus-within:border-emerald-500 disabled:cursor-not-allowed text-white font-medium;
}

input {
  @apply h-full py-3 pl-4 bg-transparent focus:outline-none w-full placeholder:text-zinc-500 placeholder:font-normal;
}

button {
  @apply text-white;

  svg {
    @apply w-5 h-5 text-white fill-current;
  }
}

[popover] {
  @apply bg-zinc-800 rounded-md;
  position-area: bottom;
  position-anchor: v-bind(anchorId);
  inset: 0;
  margin: 0;
  margin-top: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 300px;
  scrollbar-color: #333 #111;
  scrollbar-width: thin;
  width: anchor-size(width);

  transition:
    display 250ms allow-discrete,
    overlay 250ms allow-discrete,
    opacity 250ms ease-in-out,
    transform 250ms ease-in-out;

  opacity: 0;
  transform: translateY(-10px) scale(0.95);

  &:popover-open {
    opacity: 1;
    transform: translateY(0) scale(1);

    @starting-style {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
  }
}

.trigger {
  anchor-name: v-bind(anchorId);
}

.hint {
  @apply text-white text-gray-400;

  &.is-error {
    @apply text-red-500;
  }
}
</style>
