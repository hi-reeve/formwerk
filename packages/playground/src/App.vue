<script setup lang="ts">
import { useForm } from '@formwerk/core';
import InputNumber from '@/components/InputNumber.vue';
import { useI18n } from 'vue-i18n';

const { handleSubmit } = useForm();

const onSubmit = handleSubmit(data => {
  alert(JSON.stringify(data.toJSON(), null, 2));
});

const { locale } = useI18n();
</script>

<template>
  <form @submit="onSubmit" novalidate>
    {{ locale }}

    <InputNumber name="number" label="Number" :format-options="{ style: 'currency', currency: 'USD' }" />

    <button type="submit">Submit</button>
  </form>

  <button @click="locale = locale === 'ar-EG' ? 'en-US' : 'ar-EG'">Change Locale</button>
</template>
