<template>
  <RadioGroup label="Radio Group" description="There is only one right answer" :schema="schema">
    <InputRadioItem label="Tea 🍵" value="🍵" />
    <InputRadioItem label="Coffee ☕️" value="☕️" />
    <InputRadioItem label="Milk 🥛" value="🥛" />
  </RadioGroup>

  <RadioGroup
    label="Radio Group"
    :model-value="'☕️'"
    description="There is only one right answer"
    :schema="schema"
    readonly
  >
    <RadioItem label="Tea 🍵" value="🍵" />
    <RadioItem label="Coffee ☕️" value="☕️" />
    <RadioItem label="Milk 🥛" value="🥛" />
  </RadioGroup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { z } from 'zod';
import InputText from '@/components/InputText.vue';
import InputNumber from '@/components/InputNumber.vue';
import InputTextArea from '@/components/InputTextArea.vue';
import InputSearch from '@/components/InputSearch.vue';
import SwitchInput from '@/components/SwitchInput.vue';
import Switch from '@/components/Switch.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import InputRadioItem from '@/components/InputRadioItem.vue';
import RadioItem from '@/components/RadioItem.vue';
import Slider from '@/components/Slider.vue';
import MultiSlider from '@/components/MultiSlider.vue';
import CheckboxGroup from '@/components/CheckboxGroup.vue';
import CheckboxItem from '@/components/CheckboxItem.vue';
import CheckboxInput from '@/components/CheckboxInput.vue';
import { useForm } from '@formwerk/core';
import InputSelect from '@/components/InputSelect.vue';
import OptionItem from './components/OptionItem.vue';

const model = ref('');

import { defineSchema } from '@formwerk/schema-zod';

const schema = defineSchema(
  z.string().min(1, { message: 'Please select a drink' }).endsWith('☕️', { message: 'WRONG ANSWER!' }),
);

const continents = [
  {
    label: 'Africa',
    code: 'AF',
    items: [
      { label: 'Egypt', code: 'EG' },
      { label: 'Nigeria', code: 'NG' },
      { label: 'South Africa', code: 'ZA' },
    ],
  },
  {
    label: 'America',
    code: 'AM',
    items: [
      { label: 'United States', code: 'US' },
      { label: 'Canada', code: 'CA' },
      { label: 'Brazil', code: 'BR' },
    ],
  },
  {
    label: 'Asia',
    code: 'AS',
    items: [
      { label: 'China', code: 'CN' },
      { label: 'Japan', code: 'JP' },
      { label: 'India', code: 'IN' },
    ],
  },
  {
    label: 'Europe',
    code: 'EU',
    items: [
      { label: 'Germany', code: 'DE' },
      { label: 'France', code: 'FR' },
      { label: 'United Kingdom', code: 'UK' },
    ],
  },
  {
    label: 'Oceania',
    code: 'OC',
    items: [
      { label: 'Australia', code: 'AU' },
      { label: 'New Zealand', code: 'NZ' },
    ],
  },
];

const options = [
  { name: 'Egypt', code: 'EG' },
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
];

async function getInitials() {
  await sleep(2000);

  return {
    email: 'email@gmail.com',
    amount: 20,
    area: 'Hello',
    switch: true,
    interestingSwitch: true,
    search: 'search',
    radio: '1',
    radio2: '2',
    radio2rtl: '2',
    radio3: '3',
    radio4: '2',
    radio5: '2',
    opacity: 50,
    opacity2: [20, 80],
    checkboxGroup: ['1'],
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// const form = reactive({
//   email: '',
//   amount: 0,
//   area: '',
//   switch: false,
//   interestingSwitch: false,
//   search: '',
//   radio: '',
//   radio2: '',
//   radio2rtl: '',
//   radio3: '',
//   radio4: '',
//   radio5: '',
//   opacity: 0,
//   opacity2: [0, 100],
//   opacity3: 0,
//   opacity4: [0, 100],
//   checkboxGroup1: undefined,
//   checkboxSolo1: undefined,
//   checkboxGroup2: undefined,
//   checkboxSolo2: undefined,
// });

const max = ref(10);

function onSearchSubmit(value: string) {
  console.log('search submitted', value);
}
</script>
