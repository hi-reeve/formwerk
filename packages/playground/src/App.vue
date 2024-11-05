<script setup lang="ts">
import { FormSchema, useForm } from '@formwerk/core';
import InputText from './components/InputText.vue';
import Switch from './components/Switch.vue';
import FormRepeater from './components/Repeater.vue';

const { handleSubmit, values } = useForm<FormSchema<{ email: string }>>();

values.email; // string | null

const onSubmit = handleSubmit(data => {
  console.log(data.toJSON().email); // string
});
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit="onSubmit">
    <h2 class="text-2xl font-bold text-white">Invite users</h2>
    <FormRepeater name="users" :min="1" :max="3" v-slot="{ index }">
      <InputText name="email" :label="`Email #${index + 1}`" type="email" required />

      <Switch name="admin" label="Admin" />
    </FormRepeater>

    <button class="mt-5 w-max" type="submit">Submit</button>
  </form>
</template>
