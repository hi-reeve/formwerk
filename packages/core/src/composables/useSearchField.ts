import { MaybeRefOrGetter, Ref, computed, ref, toValue } from 'vue';
import { AriaDescribableProps, AriaLabelableProps, InputEvents, TextInputBaseAttributes } from '../types/common';
import { createDescriptionProps, createErrorProps, createLabelProps, uniqId } from '../utils/common';
import { useFieldValue } from './useFieldValue';
import { useInputValidity } from './useInputValidity';
import { useSyncModel } from './useModelSync';

export interface SearchInputDOMAttributes extends TextInputBaseAttributes {
  type?: 'search';
}

export interface SearchInputDOMProps
  extends SearchInputDOMAttributes,
    AriaLabelableProps,
    AriaDescribableProps,
    InputEvents {
  id: string;
}

export interface SearchFieldProps {
  label: MaybeRefOrGetter<string>;
  modelValue?: MaybeRefOrGetter<string>;
  description?: MaybeRefOrGetter<string>;

  onSubmit?: (value: string) => void;

  // TODO: Vue cannot resolve these types if they are mapped from up there
  name?: MaybeRefOrGetter<string>;
  value?: MaybeRefOrGetter<string>;
  maxLength?: MaybeRefOrGetter<number>;
  minLength?: MaybeRefOrGetter<number>;
  pattern?: MaybeRefOrGetter<string | undefined>;
  placeholder?: MaybeRefOrGetter<string | undefined>;

  required?: MaybeRefOrGetter<boolean>;
  readonly?: MaybeRefOrGetter<boolean>;
  disabled?: MaybeRefOrGetter<boolean>;
}

export function useSearchField(props: SearchFieldProps, elementRef?: Ref<HTMLInputElement>) {
  const inputId = uniqId();
  const inputRef = elementRef || ref<HTMLInputElement>();

  const { fieldValue } = useFieldValue<string>(toValue(props.modelValue));
  const { errorMessage, onInvalid, updateValidity, validityDetails, isInvalid } = useInputValidity(inputRef);

  useSyncModel({
    model: fieldValue,
    onModelPropUpdated: value => {
      fieldValue.value = value;
    },
  });

  const labelProps = createLabelProps(inputId);
  const descriptionProps = createDescriptionProps(inputId);
  const errorMessageProps = createErrorProps(inputId);
  const clearBtnProps = {
    tabindex: '-1',
    type: 'button' as const,
    ariaLabel: 'Clear search',
    onClick() {
      fieldValue.value = '';
      updateValidity();
    },
  };

  const handlers: InputEvents = {
    onInput: (event: Event) => {
      fieldValue.value = (event.target as HTMLInputElement).value;
      updateValidity();
    },
    onChange: (event: Event) => {
      fieldValue.value = (event.target as HTMLInputElement).value;
      updateValidity();
    },
    onBlur() {
      updateValidity();
    },
    onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && inputRef.value?.type !== 'search') {
        e.preventDefault();
        fieldValue.value = '';
        updateValidity();
      }

      if (e.key === 'Enter' && !inputRef.value?.form && props.onSubmit) {
        e.preventDefault();
        if (!isInvalid.value) {
          props.onSubmit(fieldValue.value || '');
        }
      }
    },
    onInvalid,
  };

  const inputProps = computed<SearchInputDOMProps>(() => ({
    id: inputId,
    'aria-labelledby': labelProps.id,
    name: toValue(props.name),
    value: fieldValue.value,
    type: 'search',
    required: toValue(props.required),
    readonly: toValue(props.readonly),
    disabled: toValue(props.disabled),
    maxlength: toValue(props.maxLength),
    minlength: toValue(props.minLength),
    pattern: toValue(props.pattern),
    placeholder: toValue(props.placeholder),
    'aria-describedby': errorMessage.value ? errorMessageProps.id : props.description ? descriptionProps.id : undefined,
    'aria-invalid': errorMessage.value ? true : undefined,
    ...handlers,
  }));

  return {
    inputRef,
    inputProps,
    labelProps,
    fieldValue,
    errorMessage,
    errorMessageProps,
    descriptionProps,
    clearBtnProps,
    validityDetails,
    isInvalid,
  };
}
