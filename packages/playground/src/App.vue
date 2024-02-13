<template>
  <form>
    <InputText
      name="email"
      label="Email"
      :max-length="10"
      :min-length="3"
      required
      placeholder="Sinners"
      pattern="[0-9]+"
    />

    <InputTextArea
      name="email"
      label="Email"
      :max-length="10"
      :min-length="3"
      required
      placeholder="Sinners"
      pattern="[0-9]+"
    />

    <pre>{{ model }}</pre>

    <button class="bg-blue-500 text-white px-4 py-1.5 rounded-md">KeKL</button>
  </form>

  <InputSearch name="search" label="Search" :min-length="10" @submit="onSearchSubmit" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import InputText from './components/InputText.vue';
import InputTextArea from './components/InputTextArea.vue';
import InputSearch from './components/InputSearch.vue';

const model = ref('');

function onSearchSubmit(value: string) {
  console.log(value);
}
</script>
