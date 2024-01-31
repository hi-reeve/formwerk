import { MaybeRefOrGetter, Ref, computed, shallowRef, toValue } from 'vue';
import { createDescribedByProps, createLabelProps, createRefCapture, propsToValues, uniqId } from '../utils/common';
import {
  AriaDescribableProps,
  AriaLabelableProps,
  TextInputBaseAttributes,
  InputEvents,
  AriaValidatableProps,
} from '../types/common';
import { useFieldValue } from './useFieldValue';
import { useSyncModel } from './useModelSync';
import { useInputValidity } from './useInputValidity';

export type TextInputDOMType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

export interface TextInputDOMAttributes extends TextInputBaseAttributes {
  type?: TextInputDOMType;
}

export interface TextInputDOMProps
  extends TextInputDOMAttributes,
    AriaLabelableProps,
    AriaDescribableProps,
    AriaValidatableProps,
    InputEvents {
  id: string;
}

export interface TextFieldProps {
  label: MaybeRefOrGetter<string>;
  modelValue?: MaybeRefOrGetter<string>;
  description?: MaybeRefOrGetter<string>;

  // TODO: Vue cannot resolve these types if they are mapped from up there
  name?: MaybeRefOrGetter<string>;
  value?: MaybeRefOrGetter<string>;
  type?: MaybeRefOrGetter<TextInputDOMType>;
  maxLength?: MaybeRefOrGetter<number>;
  minLength?: MaybeRefOrGetter<number>;
  pattern?: MaybeRefOrGetter<string | undefined>;
  placeholder?: MaybeRefOrGetter<string | undefined>;

  required?: MaybeRefOrGetter<boolean>;
  readonly?: MaybeRefOrGetter<boolean>;
  disabled?: MaybeRefOrGetter<boolean>;
}

export function useTextField(props: TextFieldProps, elementRef?: Ref<HTMLInputElement | HTMLTextAreaElement>) {
  const inputId = uniqId();
  const inputRef = elementRef || shallowRef<HTMLInputElement>();
  const { fieldValue } = useFieldValue<string>(toValue(props.modelValue));
  const { errorMessage, onInvalid, updateValidity, validityDetails, isInvalid } = useInputValidity(inputRef);

  useSyncModel({
    model: fieldValue,
    onModelPropUpdated: value => {
      fieldValue.value = value;
    },
  });

  const labelProps = createLabelProps(inputId);
  const { errorMessageProps, descriptionProps, describedBy } = createDescribedByProps({
    inputId,
    errorMessage,
    description: props.description,
  });

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
    onInvalid,
  };

  const inputProps = computed<TextInputDOMProps>(() => {
    const baseProps: TextInputDOMProps = {
      ...propsToValues(props, ['name', 'type', 'placeholder', 'required', 'readonly', 'disabled']),
      id: inputId,
      'aria-labelledby': labelProps.id,
      value: fieldValue.value,
      maxlength: toValue(props.maxLength),
      minlength: toValue(props.minLength),
      pattern: inputRef.value?.tagName === 'TEXTAREA' ? undefined : toValue(props.pattern),
      'aria-describedby': describedBy(),
      'aria-invalid': errorMessage.value ? true : undefined,
      ...handlers,
    };

    // If they passed an element ref then we don't need to override it.
    if (!elementRef) {
      // Capture the ref
      (baseProps as any).ref = createRefCapture(inputRef);
    }

    return baseProps;
  });

  return {
    inputRef,
    inputProps,
    labelProps,
    fieldValue,
    errorMessage,
    errorMessageProps,
    descriptionProps,
    validityDetails,
    isInvalid,
  };
}
