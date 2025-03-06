import { defineComponent } from 'vue';
import { useHiddenField, type HiddenFieldProps } from './useHiddenField';

/**
 * A helper component that renders a hidden field. You can build your own with `useHiddenField`.
 */
export const HiddenField = /*#__PURE__*/ defineComponent<HiddenFieldProps>({
  name: 'HiddenField',
  props: { name: String, value: null, disabled: Boolean },
  setup(props) {
    useHiddenField(props);

    return () => [];
  },
});
