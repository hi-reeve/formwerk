import { fireEvent, render, screen } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { SwitchProps, useSwitch } from './useSwitch';
import { flush } from '@test-utils/flush';
import { describe } from 'vitest';

describe('with input as base element', () => {
  const label = 'Subscribe to our newsletter';

  async function renderSwitch(props: Partial<SwitchProps<any>> = {}) {
    await render({
      setup() {
        const { inputProps, labelProps, isPressed, errorMessageProps, errorMessage, fieldValue } = useSwitch({
          label,
          ...props,
        });

        return {
          inputProps,
          labelProps,
          isPressed,
          label,
          errorMessageProps,
          errorMessage,
          fieldValue,
        };
      },
      template: `
      <div data-testid="fixture">
        <input v-bind="inputProps" type="checkbox" />
        <label class="ml-2" v-bind="labelProps">{{ label }}</label>
        <div data-testid="value">{{ fieldValue }}</div>
        <span v-bind="errorMessageProps">{{ errorMessage }}</span>
      </div>
    `,
    });
  }

  test('should not have a11y errors', async () => {
    await renderSwitch();

    await flush();
    vi.useRealTimers();
    expect(await axe(screen.getByTestId('fixture'))).toHaveNoViolations();
    vi.useFakeTimers();
  });

  test('clicking toggles the value', async () => {
    await renderSwitch();

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('true');
    expect(screen.getByLabelText(label)).toBeChecked();
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
  });

  test('Space key or Enter toggles the value', async () => {
    await renderSwitch();

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('true');
    expect(screen.getByLabelText(label)).toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
  });

  test('Can toggle between two custom values', async () => {
    const label = 'Subscribe to our newsletter';
    const trueValue = { yes: true };
    const falseValue = 'nay';

    await renderSwitch({ trueValue, falseValue });

    expect(screen.getByTestId('value')).toHaveTextContent('nay');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toContainHTML('"yes": true');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('nay');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toContainHTML('"yes": true');
  });

  test('picks up native validation', async () => {
    const label = 'Subscribe to our newsletter';
    await renderSwitch({ required: true });

    await fireEvent.invalid(screen.getByLabelText(label));
    await flush();
    expect(screen.getByLabelText(label)).toHaveErrorMessage('Constraints not satisfied');

    vi.useRealTimers();
    expect(await axe(screen.getByTestId('fixture'))).toHaveNoViolations();
    vi.useFakeTimers();
  });

  test('Clicks, Space key, or Enter are ignored when disabled', async () => {
    await renderSwitch({ disabled: true });

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
  });

  test('Clicks, Space key, or Enter are ignored when readonly', async () => {
    await renderSwitch({ readonly: true });

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).not.toBeChecked();
  });
});

describe('with custom base element', () => {
  const label = 'Subscribe to our newsletter';

  async function renderSwitch(props: Partial<SwitchProps> = {}) {
    await render({
      setup() {
        const { inputProps, labelProps, isPressed, fieldValue } = useSwitch({
          label,
          ...props,
        });

        return {
          inputProps,
          labelProps,
          isPressed,
          label,
          fieldValue,
        };
      },
      template: `
        <div data-testid="fixture">
          <div v-bind="inputProps"></div>
          <div class="ml-2" v-bind="labelProps">{{ label }}</div>
          <div data-testid="value">{{ fieldValue }}</div>
        </div>
      `,
    });
  }

  test('should not have a11y errors with custom base element implementation', async () => {
    await renderSwitch();

    await flush();
    vi.useRealTimers();
    expect(await axe(screen.getByTestId('fixture'))).toHaveNoViolations();
    vi.useFakeTimers();
  });

  test('clicking toggles the value', async () => {
    await renderSwitch();

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('true');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'true');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
  });

  test('Space key or Enter toggles the value', async () => {
    await renderSwitch();

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('true');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'true');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
  });

  test('Clicks, Space key, or Enter are ignored when disabled', async () => {
    await renderSwitch({ disabled: true });

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
  });

  test('Clicks, Space key, or Enter are ignored when readonly', async () => {
    await renderSwitch({ readonly: true });

    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Enter' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.keyDown(screen.getByLabelText(label), { code: 'Space' });
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
    await fireEvent.click(screen.getByLabelText(label));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-checked', 'false');
  });
});
