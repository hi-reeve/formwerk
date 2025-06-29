import { ref } from 'vue';
import { Reactivify } from '../types';
import { useLabel } from '../a11y/useLabel';
import { normalizeProps, useUniqId, useCaptureProps } from '../utils/common';
import { FieldTypePrefixes } from '../constants';
import { createDisabledContext } from '../helpers/createDisabledContext';

export interface OptionGroupProps {
  /**
   * The label text for the option group.
   */
  label: string;

  /**
   * Whether the option group is disabled.
   */
  disabled?: boolean;
}

export function useOptionGroup(_props: Reactivify<OptionGroupProps>) {
  const groupEl = ref<HTMLElement>();
  const props = normalizeProps(_props);
  const groupId = useUniqId(FieldTypePrefixes.OptionGroup);
  const isDisabled = createDisabledContext(props.disabled);

  const { labelProps, labelledByProps } = useLabel({
    label: props.label,
    for: groupId,
    targetRef: groupEl,
  });

  const groupProps = useCaptureProps(() => {
    return {
      id: groupId,
      role: 'group',
      ...labelledByProps.value,
    };
  }, groupEl);

  return {
    /**
     * Props for the label element.
     */
    labelProps,
    /**
     * Props for the group element.
     */
    groupProps,
    /**
     * Reference to the group element.
     */
    groupEl,
    /**
     * Whether the option group is disabled.
     */
    isDisabled,
  };
}
