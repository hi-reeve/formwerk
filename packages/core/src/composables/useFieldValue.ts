import { Ref, ref } from 'vue';

export function useFieldValue<TValue = unknown>(initial?: TValue) {
  const fieldValue = ref(initial || undefined) as Ref<TValue | undefined>;

  return {
    fieldValue,
  };
}
