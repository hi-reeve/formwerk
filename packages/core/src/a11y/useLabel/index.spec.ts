import { render, screen } from '@testing-library/vue';
import { useLabel } from '.';
import { ref } from 'vue';

describe('label element', () => {
  test('should render label with `for` attribute', async () => {
    const label = 'label';
    const labelFor = 'input';

    await render({
      setup: () =>
        useLabel({
          for: labelFor,
          label: label,
        }),
      template: `
      <label data-testid="label" v-bind="labelProps">Label</label>
    `,
    });

    const labelEl = screen.getByTestId('label');
    expect(labelEl?.getAttribute('for')).toBe(labelFor);
  });

  test('should omit `for` attribute if label is not a label element', async () => {
    const label = 'label';
    const labelFor = 'input';

    await render({
      setup: () =>
        useLabel({
          for: labelFor,
          label: label,
        }),
      template: `
      <span data-testid="label" v-bind="labelProps">Label</span>
    `,
    });

    const labelEl = screen.getByTestId('label');
    expect(labelEl.hasAttribute('for')).toBe(false);
  });
});

describe('label target (labelledBy)', () => {
  test('should have aria-label if there is no target element or label element', async () => {
    const label = 'label';
    const labelFor = 'input';
    await render({
      setup: () =>
        useLabel({
          label: label,
          for: labelFor,
        }),
      template: `
      <span data-testid="target" v-bind="labelledByProps"></span>
    `,
    });

    const labelEl = screen.getByTestId('target');
    expect(labelEl?.hasAttribute('aria-labelledby')).toBe(false);
    expect(labelEl?.getAttribute('aria-label')).toBe(label);
  });

  test('should have aria-labelledby if there is both a target element and a label element', async () => {
    const label = 'label';
    const labelFor = 'input';
    const targetRef = ref<HTMLElement>();

    await render({
      setup: () => {
        return {
          ...useLabel({
            label: label,
            for: labelFor,
            targetRef: targetRef,
          }),
          targetRef,
        };
      },
      template: `
      <span data-testid="label" v-bind="labelProps"></span>
      <input data-testid="input" ref="targetRef" v-bind="labelledByProps">
    `,
    });

    expect(screen.getByTestId('input')?.getAttribute('aria-labelledby')).toBe(`${labelFor}-l`);
  });
});
