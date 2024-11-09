import {
  computed,
  defineComponent,
  h,
  inject,
  MaybeRefOrGetter,
  nextTick,
  onMounted,
  readonly,
  ref,
  toValue,
  VNode,
  watch,
} from 'vue';
import { Numberish, Reactivify } from '../types';
import { FormKey } from '../useForm';
import {
  cloneDeep,
  fromNumberish,
  isEqual,
  isNullOrUndefined,
  normalizeProps,
  useUniqId,
  warn,
  withRefCapture,
} from '../utils/common';
import { FieldTypePrefixes } from '../constants';
import { createPathPrefixer } from '../helpers/usePathPrefixer';
import { prefixPath } from '../utils/path';
import { Simplify } from 'type-fest';

export interface FormRepeaterProps {
  name: string;

  min?: Numberish;
  max?: Numberish;

  addButtonLabel?: string;
  removeButtonLabel?: string;
  moveUpButtonLabel?: string;
  moveDownButtonLabel?: string;
}

export interface FormRepeaterButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export interface FormRepeaterButtonDomProps {
  type: 'button' | undefined;
  role: 'button' | undefined;
  disabled?: boolean | undefined;
  'aria-disabled'?: boolean | undefined;
  'aria-label': string;
  onClick: () => void;
}

export interface FormRepeaterIterationSlotProps {
  index: number;
  path: string;
  key: string;
  moveDownButtonProps: FormRepeaterButtonDomProps;
  moveUpButtonProps: FormRepeaterButtonDomProps;
  removeButtonProps: FormRepeaterButtonDomProps;
}

export function useFormRepeater<TItem = unknown>(_props: Reactivify<FormRepeaterProps>) {
  const id = useUniqId(FieldTypePrefixes.FormRepeater);
  let counter = 0;
  const form = inject(FormKey, null);
  const repeaterProps = normalizeProps(_props);
  const getPath = () => toValue(repeaterProps.name);
  const getPathValue = () => (form?.getFieldValue(getPath()) || []) as TItem[];
  let lastControlledValueSnapshot: TItem[] | undefined;
  const records = ref(buildRecords());

  function generateRecord(): string {
    return `${id}-${counter++}`;
  }

  function buildRecords(): string[] {
    const pathArray = getPathValue();
    const length = Math.max(fromNumberish(repeaterProps.min) ?? 0, pathArray.length);
    lastControlledValueSnapshot = cloneDeep(pathArray);

    return Array.from({ length }).fill(null).map(generateRecord);
  }

  if (__DEV__) {
    if (!getPath()) {
      warn('"name" prop is required for useFormRepeater');
    }
  }

  async function mutateWith(mutate: () => void) {
    mutate();
    await nextTick();
    lastControlledValueSnapshot = cloneDeep(getPathValue());
  }

  function canAdd(count = 1) {
    const max = fromNumberish(repeaterProps.max);
    if (!max) {
      return true;
    }

    return records.value.length + count <= max;
  }

  function canRemove(count = 1) {
    const min = fromNumberish(repeaterProps.min);
    if (!min) {
      return true;
    }

    return records.value.length - count >= min;
  }

  function add(count = 1) {
    if (!canAdd(count)) {
      if (__DEV__) {
        warn(`Cannot add ${count} item(s) to repeater since max is ${toValue(repeaterProps.max)}`);
      }
      return;
    }

    mutateWith(() => {
      for (let i = 0; i < count; i++) {
        records.value.push(generateRecord());
      }
    });
  }

  function remove(index: number) {
    if (!canRemove()) {
      if (__DEV__) {
        warn(`Cannot remove item from repeater since min is ${toValue(repeaterProps.min)}`);
      }
      return;
    }

    mutateWith(() => {
      records.value.splice(index, 1);
    });
  }

  function insert(index: number) {
    if (!canAdd()) {
      if (__DEV__) {
        warn(`Cannot insert item to repeater since max is ${toValue(repeaterProps.max)}`);
      }
      return;
    }

    mutateWith(() => {
      records.value.splice(index, 0, generateRecord());
    });
  }

  function move(from: number, to: number) {
    mutateWith(() => {
      records.value.splice(to, 0, records.value.splice(from, 1)[0]);
    });
  }

  function swap(indexA: number, indexB: number) {
    mutateWith(() => {
      const newRecords = [...records.value];
      newRecords[indexA] = records.value[indexB];
      newRecords[indexB] = records.value[indexA];
      records.value = newRecords;
    });
  }

  const addButtonProps = createBtnProps({
    label: () => toValue(repeaterProps.addButtonLabel) ?? 'Add',
    onClick: () => add(),
    disabled: () => !canAdd(),
  });

  function createIterationButtonProps(index: MaybeRefOrGetter<number>) {
    const removeButtonProps = createBtnProps({
      label: () => toValue(repeaterProps.removeButtonLabel) ?? 'Remove',
      disabled: () => !canRemove(),
      onClick: () => remove(toValue(index)),
    });

    const moveUpButtonProps = createBtnProps({
      label: () => toValue(repeaterProps.moveUpButtonLabel) ?? 'Move up',
      disabled: () => toValue(index) === 0,
      onClick: () => {
        move(toValue(index), toValue(index) - 1);
      },
    });

    const moveDownButtonProps = createBtnProps({
      label: () => toValue(repeaterProps.moveDownButtonLabel) ?? 'Move down',
      disabled: () => toValue(index) === records.value.length - 1,
      onClick: () => {
        const idx = toValue(index);

        move(idx, idx + 1);
      },
    });

    return {
      removeButtonProps,
      moveUpButtonProps,
      moveDownButtonProps,
    };
  }

  const Iteration = defineComponent<{ index: number; as?: string; noButtonProps?: boolean }>({
    name: 'FormRepeaterIteration',
    props: {
      as: { type: String, required: false },
      index: Number,
    },
    setup(props, { slots, attrs }) {
      // Prefixes the path with the index of the repeater
      // If a path is not provided, even as an empty string, it will be considered an uncontrolled path.
      // This is a minor divergence from the controlled/uncontrolled behavior of form fields,
      createPathPrefixer(path =>
        isNullOrUndefined(path) ? undefined : prefixPath(getPath(), `${props.index}${path ? `.${path}` : ''}`),
      );

      const { removeButtonProps, moveUpButtonProps, moveDownButtonProps } = createIterationButtonProps(
        () => props.index,
      );

      const getSlotProps = () => ({
        removeButtonProps: removeButtonProps.value,
        moveUpButtonProps: moveUpButtonProps.value,
        moveDownButtonProps: moveDownButtonProps.value,
      });

      return () => {
        if (props.as) {
          return h(props.as, attrs, { default: () => slots.default?.(getSlotProps()) });
        }

        return slots.default?.(getSlotProps());
      };
    },
  });

  if (form) {
    onMounted(() => {
      watch(getPathValue, value => {
        if (!isEqual(value, lastControlledValueSnapshot)) {
          records.value = buildRecords();
        }
      });
    });
  }

  return {
    items: readonly(records),
    addButtonProps,
    add,
    swap,
    remove,
    move,
    insert,
    Iteration: Iteration as typeof Iteration & {
      new (): {
        $slots: {
          default: (args: Simplify<Omit<FormRepeaterIterationSlotProps, 'index' | 'path' | 'key'>>) => VNode[];
        };
      };
    },
  };
}

function createBtnProps(_props: Reactivify<FormRepeaterButtonProps, 'onClick'>) {
  const props = normalizeProps(_props, ['onClick']);
  const buttonEl = ref<HTMLElement>();

  const buttonProps = computed<FormRepeaterButtonDomProps>(() => {
    const isBtnTag = buttonEl.value?.tagName === 'BUTTON';

    return withRefCapture(
      {
        'aria-label': toValue(props.label),
        type: isBtnTag ? 'button' : undefined,
        role: isBtnTag ? undefined : 'button',
        onClick: props.onClick,
        disabled: isBtnTag ? (toValue(props.disabled) ?? undefined) : undefined,
        'aria-disabled': isBtnTag ? undefined : (toValue(props.disabled) ?? undefined),
      },
      buttonEl,
    );
  });

  return buttonProps;
}
