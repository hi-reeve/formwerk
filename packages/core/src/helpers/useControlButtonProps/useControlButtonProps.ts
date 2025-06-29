import { shallowRef } from 'vue';
import { isButtonElement, useCaptureProps } from '../../utils/common';

interface ControlButtonProps {
  [key: string]: unknown;
  disabled?: boolean;
}

export function useControlButtonProps(props: (el: HTMLElement | undefined) => ControlButtonProps) {
  const buttonEl = shallowRef<HTMLElement>();

  const buttonProps = useCaptureProps(() => {
    const isBtn = isButtonElement(buttonEl.value);
    const { disabled, ...rest } = props(buttonEl.value);

    return {
      type: isBtn ? ('button' as const) : undefined,
      role: isBtn ? undefined : 'button',
      [isBtn ? 'disabled' : 'aria-disabled']: disabled || undefined,
      tabindex: '-1',
      ...rest,
    };
  }, buttonEl);

  return buttonProps;
}
