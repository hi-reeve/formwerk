import { defineComponent } from 'vue';
import { useHiddenField, type HiddenFieldProps } from './useHiddenField';

export const HiddenField = defineComponent<HiddenFieldProps>({
  name: 'HiddenField',
  props: { name: String, value: null, disabled: Boolean },
  setup(props) {
    useHiddenField(props);

    return () => [];
  },
});
