import { Ref, computed, nextTick, ref, shallowRef } from 'vue';
import { useEventListener } from '../helpers/useEventListener';

export function useInputValidity(inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement | undefined>) {
  const errorMessage = ref<string>();
  const validityDetails = shallowRef<ValidityState>();
  const isInvalid = computed(() => !!errorMessage.value);

  function onInvalid() {
    updateValidity();
  }

  function setValidity(message: string) {
    errorMessage.value = message;
    inputRef?.value?.setCustomValidity(message);
    validityDetails.value = inputRef?.value?.validity;
  }

  function updateValidity() {
    nextTick(() => {
      errorMessage.value = inputRef?.value?.validationMessage;
      validityDetails.value = inputRef?.value?.validity;
    });
  }

  useEventListener(inputRef, 'invalid', onInvalid);

  return {
    errorMessage,
    validityDetails,
    isInvalid,
    setValidity,
    updateValidity,
  };
}
