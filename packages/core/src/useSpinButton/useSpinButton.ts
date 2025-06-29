import { computed, shallowRef, toValue } from 'vue';
import { Direction, Maybe, Numberish, Orientation2D, Reactivify } from '../types';
import { toNearestMultipleOf } from '../utils/math';
import { useButtonHold } from '../helpers/useButtonHold';
import {
  fromNumberish,
  hasKeyCode,
  isButtonElement,
  isNullOrUndefined,
  normalizeProps,
  useCaptureProps,
} from '../utils/common';
import { useLocale } from '../i18n';
import { onlyMainMouseButton } from '../utils/events';

export interface SpinButtonProps {
  min?: Numberish;
  max?: Numberish;
  step?: Numberish;
  orientation?: Orientation2D;
  dir?: Direction;

  incrementLabel?: string;
  decrementLabel?: string;

  readonly?: boolean;
  disabled?: boolean;

  current?: number;
  currentText?: string;

  preventTabIndex?: boolean;

  onChange?(value: number): void;
}

function getDirectionalStepKeys(orientation: Orientation2D, direction: Direction) {
  const horizontalDirKeys: Record<Direction, { incrKeys: string[]; decrKeys: string[] }> = {
    ltr: { incrKeys: ['ArrowRight'], decrKeys: ['ArrowLeft'] },
    rtl: { incrKeys: ['ArrowLeft'], decrKeys: ['ArrowRight'] },
  };

  const horizontalKeys = horizontalDirKeys[direction];
  const verticalKeys = { incrKeys: ['ArrowUp'], decrKeys: ['ArrowDown'] };
  const incrKeys: string[] = [];
  const decrKeys: string[] = [];

  if (orientation === 'horizontal' || orientation === 'both') {
    incrKeys.push(...horizontalKeys.incrKeys);
    decrKeys.push(...horizontalKeys.decrKeys);
  }

  if (orientation === 'vertical' || orientation === 'both') {
    incrKeys.push(...verticalKeys.incrKeys);
    decrKeys.push(...verticalKeys.decrKeys);
  }

  return { incrKeys, decrKeys };
}

export function useSpinButton(_props: Reactivify<SpinButtonProps, 'onChange'>) {
  const props = normalizeProps(_props, ['onChange']);
  const { direction } = useLocale();
  const getStep = () => fromNumberish(props.step) || 1;
  const getMin = () => fromNumberish(props.min) ?? undefined;
  const getMax = () => fromNumberish(props.max) ?? undefined;
  const incrBtnEl = shallowRef<HTMLElement>();
  const decrBtnEl = shallowRef<HTMLElement>();

  /**
   * Dynamically calculate the multiplier for the page up/down keys.
   */
  const getPageMultiplier = () => {
    const max = getMax();
    const min = getMin();

    if (isNullOrUndefined(max) || isNullOrUndefined(min)) {
      return 10;
    }

    return Math.max(Math.floor(Math.abs((max - min) / min)), getStep());
  };

  function onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || toValue(props.disabled) || toValue(props.readonly)) {
      return;
    }

    if (hasKeyCode(e, 'PageUp')) {
      e.preventDefault();
      pageIncrement();
      return;
    }

    if (hasKeyCode(e, 'PageDown')) {
      e.preventDefault();
      pageDecrement();
      return;
    }

    const { incrKeys, decrKeys } = getDirectionalStepKeys(
      toValue(props.orientation) || 'both',
      toValue(props.dir) || direction.value,
    );

    if (incrKeys.includes(e.code)) {
      e.preventDefault();
      increment();
      return;
    }

    if (decrKeys.includes(e.code)) {
      e.preventDefault();
      decrement();
      return;
    }

    if (hasKeyCode(e, 'Home')) {
      e.preventDefault();
      incrementToMax();

      return;
    }

    if (hasKeyCode(e, 'End')) {
      e.preventDefault();
      decrementToMin();
      return;
    }
  }

  function applyClamp(value: number) {
    const max = getMax();
    const min = getMin();

    if (!isNullOrUndefined(max) && value >= max) {
      return max;
    }

    if (!isNullOrUndefined(min) && value <= min) {
      return min;
    }

    return value;
  }

  function tryChange(diff: number) {
    const current = toValue(props.current) || 0;
    const step = getStep();
    const next = applyClamp(toNearestMultipleOf(current + diff, step));

    props.onChange?.(next);
  }

  function increment() {
    tryChange(getStep());
  }

  function decrement() {
    tryChange(-getStep());
  }

  function pageIncrement() {
    tryChange(getStep() * getPageMultiplier());
  }

  function pageDecrement() {
    tryChange(-getStep() * getPageMultiplier());
  }

  function incrementToMax() {
    const max = getMax();
    if (!isNullOrUndefined(max)) {
      props.onChange?.(max);
    }
  }

  function decrementToMin() {
    const min = getMin();
    if (!isNullOrUndefined(min)) {
      props.onChange?.(min);
    }
  }

  const isIncrementDisabled = computed(() => {
    const max = getMax();
    const current = toValue(props.current);

    return !isNullOrUndefined(max) && current !== undefined && max <= current;
  });

  const isDecrementDisabled = computed(() => {
    const min = getMin();
    const current = toValue(props.current);

    return !isNullOrUndefined(min) && current !== undefined && min >= current;
  });

  const incrementHoldProps = useButtonHold({
    onClick: onlyMainMouseButton(increment),
    onHoldTick: onlyMainMouseButton(increment),
    disabled: isIncrementDisabled,
  });

  const decrementHoldProps = useButtonHold({
    onClick: onlyMainMouseButton(decrement),
    onHoldTick: onlyMainMouseButton(decrement),
    disabled: isDecrementDisabled,
  });

  interface BaseButtonProps {
    disabled: boolean;
  }

  function getButtonProps(btnEl: Maybe<HTMLElement>, baseProps: BaseButtonProps) {
    const isBtn = isButtonElement(btnEl);

    if (!isBtn) {
      return {
        role: 'button',
        ['aria-disabled']: baseProps.disabled || undefined,
      };
    }

    return {
      type: 'button' as const,
      disabled: baseProps.disabled,
    };
  }

  const incrementButtonProps = useCaptureProps(() => {
    return {
      ...incrementHoldProps,
      ...getButtonProps(incrBtnEl.value, { disabled: toValue(props.disabled) || isIncrementDisabled.value }),
      'aria-label': toValue(props.incrementLabel) || 'Increment',
      tabindex: toValue(props.preventTabIndex) ? '-1' : undefined,
    };
  }, incrBtnEl);

  const decrementButtonProps = useCaptureProps(() => {
    return {
      ...decrementHoldProps,
      ...getButtonProps(decrBtnEl.value, { disabled: toValue(props.disabled) || isDecrementDisabled.value }),
      'aria-label': toValue(props.decrementLabel) || 'Decrement',
      tabindex: toValue(props.preventTabIndex) ? '-1' : undefined,
    };
  }, decrBtnEl);

  const spinButtonProps = computed(() => {
    return {
      onKeydown,
      'aria-valuenow': toValue(props.current),
      'aria-valuemin': toValue(props.min),
      'aria-valuemax': toValue(props.max),
      'aria-valuetext': toValue(props.currentText),
    };
  });

  return {
    increment,
    decrement,
    pageDecrement,
    pageIncrement,
    incrementToMax,
    decrementToMin,
    applyClamp,
    incrementButtonProps,
    decrementButtonProps,
    spinButtonProps,
  };
}
