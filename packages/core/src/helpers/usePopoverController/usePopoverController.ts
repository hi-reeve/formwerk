import { MaybeRefOrGetter, Ref, shallowRef, toValue, watch } from 'vue';
import { useEventListener } from '../useEventListener';
import { Maybe } from '../../types';

interface ControllerInit {
  disabled?: MaybeRefOrGetter<boolean | undefined>;
}

export function usePopoverController(popoverEl: Ref<Maybe<HTMLElement>>, opts?: ControllerInit) {
  const isOpen = shallowRef(false);

  watch(isOpen, value => {
    const el = popoverEl.value;
    if (!el || !el.popover || toValue(opts?.disabled)) {
      return;
    }

    if (value === el.matches(':popover-open')) {
      return;
    }

    if (value) {
      el.showPopover();
      return;
    }

    el.hidePopover();
  });

  useEventListener(
    popoverEl,
    'toggle',
    (e: ToggleEvent) => {
      const shouldBeOpen = e.newState === 'open';
      if (isOpen.value === shouldBeOpen) {
        return;
      }

      isOpen.value = shouldBeOpen;
    },
    {
      disabled: opts?.disabled,
    },
  );

  return {
    isOpen,
  };
}
