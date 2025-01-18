<script setup lang="ts">
import { ref } from 'vue';
import ComboBox from '@/components/ComboBox.vue';
import OptionItem from '@/components/OptionItem.vue';

const drinks = ref([
  { value: 'coffee', label: 'Coffee ☕️' },
  { value: 'tea', label: 'Tea 🍵' },
  { value: 'milk', label: 'Milk 🥛' },
]);

function onNewDrink(value: string) {
  const newDrink = { value, label: `${value} 🍹` };
  drinks.value.push(newDrink);

  return newDrink;
}
</script>

<template>
  <ComboBox label="Select a drink" placeholder="Search..." @new-value="onNewDrink">
    <OptionItem v-for="drink in drinks" :key="drink.value" :label="drink.label" :value="drink.value" />
  </ComboBox>
</template>
