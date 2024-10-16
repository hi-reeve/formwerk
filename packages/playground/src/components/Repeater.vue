<script setup lang="ts">
import { useFormRepeater, type FormRepeaterProps } from '@formwerk/core';

const props = defineProps<FormRepeaterProps>();

const { items, addButtonProps, Iteration } = useFormRepeater(props);
</script>

<template>
  <div class="repeater-container">
    <TransitionGroup name="list">
      <Iteration
        v-for="(key, index) in items"
        :index="index"
        :key="key"
        as="div"
        class="repeater-item"
        v-slot="{ removeButtonProps, moveUpButtonProps, moveDownButtonProps }"
      >
        <div class="repeater-item-content">
          <slot />
        </div>

        <div class="repeater-item-buttons">
          <button v-bind="moveUpButtonProps">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
              <path
                d="M231.39,123.06A8,8,0,0,1,224,128H184v80a16,16,0,0,1-16,16H88a16,16,0,0,1-16-16V128H32a8,8,0,0,1-5.66-13.66l96-96a8,8,0,0,1,11.32,0l96,96A8,8,0,0,1,231.39,123.06Z"
              ></path>
            </svg>
          </button>

          <button v-bind="removeButtonProps" class="remove-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
              <path
                d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
              ></path>
            </svg>
          </button>

          <button v-bind="moveDownButtonProps">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M229.66,141.66l-96,96a8,8,0,0,1-11.32,0l-96-96A8,8,0,0,1,32,128H72V48A16,16,0,0,1,88,32h80a16,16,0,0,1,16,16v80h40a8,8,0,0,1,5.66,13.66Z"
              ></path>
            </svg>
          </button>
        </div>
      </Iteration>
    </TransitionGroup>

    <button v-bind="addButtonProps" class="add-button">Add</button>
  </div>
</template>

<style scoped>
.add-button {
  margin-top: 1rem;
  padding: 4px;
  border-radius: 6px;
  background-color: #059669;
  color: #fff;
  width: max-content;
}

.repeater-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.repeater-item {
  border: 1px solid #e7e5e4;
  max-width: 280px;
  border-radius: 6px;
  display: flex;
  gap: 12px;

  .repeater-item-buttons {
    background: #f5f5f4;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    flex-direction: column;

    button {
      border: none;
      background: transparent;
      cursor: pointer;
      color: #0284c7;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
      }

      &.remove-button {
        color: #b91c1c;
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        color: #44403c;
      }
    }
  }

  .repeater-item-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.repeater-list-move,
.repeater-list-enter-active,
.repeater-list-leave-active {
  transition: all 0.5s ease;
}

.repeater-list-enter-from,
.repeater-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.repeater-list-leave-active {
  position: absolute;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
