<script setup lang="ts">
import { useForm } from '@formwerk/core';
import InputText from '@/components/InputText.vue';
import Checkbox from '@/components/CheckboxInput.vue';
import FormRepeater from '@/components/Repeater.vue';

const { handleSubmit } = useForm();

const onSubmit = handleSubmit(data => {
  alert(JSON.stringify(data.toJSON(), null, 2));
});
</script>

<template>
  <form @submit="onSubmit" novalidate>
    <FormRepeater name="users" min="1">
      <InputText name="email" label="Email Address" required type="email" />
      <Checkbox name="isAdmin" label="is Admin" />
    </FormRepeater>

    <button type="submit">Submit</button>
  </form>
</template>
