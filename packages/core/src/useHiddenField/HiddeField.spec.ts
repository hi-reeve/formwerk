import { render, screen } from '@testing-library/vue';
import { HiddenField } from '.';
import { useForm } from '../useForm';
import { flush } from '@test-utils/flush';
import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';

describe('HiddenField component', () => {
  test('should not render anything', async () => {
    await render({
      components: { HiddenField },
      setup() {
        const { formProps } = useForm();

        return { formProps };
      },
      template: `
        <HiddenField name="hidden-field" value="test-value" />
      `,
    });

    await flush();
  });

  test('should set the value on the form', async () => {
    let getValues!: () => ReturnType<typeof useForm>['values'];
    await render({
      components: { HiddenField },
      setup() {
        const { formProps, values } = useForm();
        getValues = () => values;

        return { formProps };
      },
      template: `
        <HiddenField name="hidden-field" value="test-value" />
      `,
    });

    await flush();
    expect(getValues()).toEqual({ 'hidden-field': 'test-value' });
  });

  test('should update the value on the form when it changes', async () => {
    const val = ref('test-value');
    let getValues!: () => ReturnType<typeof useForm>['values'];
    await render({
      components: { HiddenField },
      setup() {
        const { formProps, values } = useForm();
        getValues = () => values;

        return { formProps, val };
      },
      template: `
        <HiddenField name="hidden-field" :value="val" />
      `,
    });

    await flush();
    expect(getValues()).toEqual({ 'hidden-field': 'test-value' });

    val.value = 'updated-value';
    await flush();
    expect(getValues()).toEqual({ 'hidden-field': 'updated-value' });
  });

  test('should not submit value when disabled', async () => {
    const onSubmit = vi.fn();

    await render({
      components: { HiddenField },
      setup() {
        const { formProps } = useForm();
        return { formProps, onSubmit };
      },
      template: `
        <form v-bind="formProps" data-testid="form" @submit.prevent="onSubmit">
          <HiddenField name="hidden-field" value="test-value" disabled />
          <button type="submit">Submit</button>
        </form>
      `,
    });

    const form = screen.getByTestId('form');
    const formData = new FormData(form as HTMLFormElement);
    await flush();
    expect(formData.get('hidden-field')).toBeNull();
  });
});
