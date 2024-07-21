import { Ref, computed, nextTick, ref, shallowRef } from 'vue';
import { useEventListener } from '../helpers/useEventListener';

interface InputValidityOptions {
  events?: string[];
}

export function useInputValidity(
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement | undefined>,
  opts?: InputValidityOptions,
) {
  const errorMessage = ref<string>();
  const validityDetails = shallowRef<ValidityState>();
  const isInvalid = computed(() => !!errorMessage.value);

  function setValidity(message: string) {
    errorMessage.value = message;
    inputRef?.value?.setCustomValidity(message);
    validityDetails.value = inputRef?.value?.validity;
  }

  async function updateValidity() {
    await nextTick();
    errorMessage.value = inputRef?.value?.validationMessage;
    validityDetails.value = inputRef?.value?.validity;
  }

  useEventListener(inputRef, opts?.events || ['invalid', 'change', 'blur'], updateValidity);

  return {
    errorMessage,
    validityDetails,
    isInvalid,
    setValidity,
    updateValidity,
  };
}
