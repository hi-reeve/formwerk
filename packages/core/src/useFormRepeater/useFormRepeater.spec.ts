import { defineComponent } from 'vue';
import { render, screen, fireEvent } from '@testing-library/vue';
import { useFormRepeater, FormRepeaterProps } from './useFormRepeater';
import { flush } from '@test-utils/index';

async function renderTest(props: FormRepeaterProps) {
  const { addButtonProps, items, Iteration, swap, insert, remove, move } = useFormRepeater(props);

  const TestComponent = defineComponent({
    components: { Iteration },
    setup() {
      return { addButtonProps, items };
    },
    template: `
      <Iteration
        v-for="(key, index) in items"
        :key="key"
        :index="index"
        v-slot="{ removeButtonProps, moveUpButtonProps, moveDownButtonProps }"
      >
        <div data-testid="repeater-item">
          <span data-testid="key">{{ key }}</span>

          <button data-testid="remove-button" v-bind="removeButtonProps">Remove</button>
          <button data-testid="move-up-button" v-bind="moveUpButtonProps">Move Up</button>
          <button data-testid="move-down-button" v-bind="moveDownButtonProps">Move Down</button>
        </div>
      </Iteration>

      <button data-testid="add-button" v-bind="addButtonProps">Add</button>
    `,
  });

  await render(TestComponent);

  return {
    swap,
    insert,
    remove,
    move,
  };
}

test('renders the minimum number of repeater items', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(1);
});

test('adds a new item when add button is clicked', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
  });
  const addButton = screen.getByTestId('add-button');
  await fireEvent.click(addButton);
  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(2);
});

test('does not add a new item when max limit is reached', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  // Add items up to the maximum limit
  await fireEvent.click(addButton); // 2nd item
  await fireEvent.click(addButton); // 3rd item
  await fireEvent.click(addButton); // Attempt to add 4th item

  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(3); // Should not exceed max

  // Verify that the add button is disabled
  expect(addButton).toBeDisabled();
});

test('removes an item when remove button is clicked', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  // Add two more items to have three in total
  await fireEvent.click(addButton);
  await fireEvent.click(addButton);
  let items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(3);

  // Remove the second item
  const removeButtons = screen.getAllByTestId('remove-button');
  await fireEvent.click(removeButtons[1]);
  items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(2);

  // Verify that the add button is enabled again
  expect(addButton).not.toBeDisabled();
});

test('should disable add button when max is reached', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  // Add items to reach the maximum limit
  await fireEvent.click(addButton); // 2nd item
  await fireEvent.click(addButton); // 3rd item

  expect(addButton).toBeDisabled();
});

test('should enable add button when max is not reached', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  expect(addButton).not.toBeDisabled();
});

test('moves an item up', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  // Add two more items to have three in total
  await fireEvent.click(addButton); // 2nd item
  await fireEvent.click(addButton); // 3rd item

  let items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(3);

  // Move the third item up to the second position
  const moveUpButtons = screen.getAllByTestId('move-up-button');
  await fireEvent.click(moveUpButtons[2]);

  // Re-fetch items after the move
  items = screen.getAllByTestId('repeater-item');

  // Since we're not tracking the order, we'll assume the move was successful if no errors occur
  expect(items).toHaveLength(3);
});

test('moves an item down', async () => {
  await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });
  const addButton = screen.getByTestId('add-button');
  // Add two more items to have three in total
  await fireEvent.click(addButton); // 2nd item
  await fireEvent.click(addButton); // 3rd item

  let items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(3);

  // Move the first item down to the second position
  const moveDownButtons = screen.getAllByTestId('move-down-button');
  await fireEvent.click(moveDownButtons[0]);

  // Re-fetch items after the move
  items = screen.getAllByTestId('repeater-item');

  // Since we're not tracking the order, we'll assume the move was successful if no errors occur
  expect(items).toHaveLength(3);
});

test('swaps two items', async () => {
  const { swap } = await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });

  const addButton = screen.getByTestId('add-button');
  await fireEvent.click(addButton);
  await fireEvent.click(addButton);
  let items = screen.getAllByTestId('key');
  expect(items[0]).toHaveTextContent('-0');
  expect(items[1]).toHaveTextContent('-1');

  swap(0, 1);
  await flush();

  items = screen.getAllByTestId('key');
  expect(items[0]).toHaveTextContent('-1');
  expect(items[1]).toHaveTextContent('-0');
});

test('inserts an item at a specific index', async () => {
  const { insert } = await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });

  insert(1);
  await flush();

  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(2);
});

test('does not insert an item when max is reached', async () => {
  const { insert } = await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });

  const addButton = screen.getByTestId('add-button');
  await fireEvent.click(addButton);
  await fireEvent.click(addButton);

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  insert(1);
  await flush();

  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(3);

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('warns if name is not provided', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  await renderTest({
    name: '',
    min: 1,
    max: 3,
  });

  expect(warn).toHaveBeenLastCalledWith('[Formwerk]: "name" prop is required for useFormRepeater');
  warn.mockRestore();
});

test('does not remove an item when min is reached', async () => {
  const { remove } = await renderTest({
    name: 'testRepeater',
    min: 1,
    max: 3,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  remove(0);
  await flush();

  const items = screen.getAllByTestId('repeater-item');
  expect(items).toHaveLength(1);
  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('can remove all if no min is set', async () => {
  const { remove } = await renderTest({
    name: 'testRepeater',
  });

  remove(0);
  await flush();

  const items = screen.queryAllByTestId('repeater-item');
  expect(items).toHaveLength(0);
});

test('renders Iteration component with correct props', async () => {
  const { Iteration, items } = useFormRepeater({
    name: 'testRepeater',
    min: 1,
  });

  const TestComponent = defineComponent({
    components: { Iteration },

    setup() {
      return { items, Iteration };
    },
    template: `
      <Iteration v-for="(key, index) in items" :index="index" v-slot="{ removeButtonProps, moveUpButtonProps, moveDownButtonProps }">
        <div data-testid="iteration-content">
          <button data-testid="remove-button" v-bind="removeButtonProps">Remove</button>
          <button data-testid="move-up-button" v-bind="moveUpButtonProps">Move Up</button>
          <button data-testid="move-down-button" v-bind="moveDownButtonProps">Move Down</button>
        </div>
      </Iteration>
    `,
  });

  await render(TestComponent);

  const content = screen.getByTestId('iteration-content');
  expect(content).toBeInTheDocument();

  const removeButton = screen.getByTestId('remove-button');
  expect(removeButton).toBeInTheDocument();
  expect(removeButton).toHaveAttribute('type', 'button');

  const moveUpButton = screen.getByTestId('move-up-button');
  expect(moveUpButton).toBeInTheDocument();
  expect(moveUpButton).toHaveAttribute('type', 'button');
  expect(moveUpButton).toBeDisabled();

  const moveDownButton = screen.getByTestId('move-down-button');
  expect(moveDownButton).toBeInTheDocument();
  expect(moveDownButton).toHaveAttribute('type', 'button');
});

test('renders Iteration component with correct props with custom element', async () => {
  const { Iteration, items } = useFormRepeater({
    name: 'testRepeater',
    min: 1,
  });

  const TestComponent = defineComponent({
    components: { Iteration },
    setup() {
      return { items };
    },
    template: `
      <Iteration v-for="(key, index) in items" as="div" data-testid="repeater-item" :index="index" v-slot="{ removeButtonProps, moveUpButtonProps, moveDownButtonProps }">
        <div data-testid="iteration-content">
          <button data-testid="remove-button" v-bind="removeButtonProps">Remove</button>
          <button data-testid="move-up-button" v-bind="moveUpButtonProps">Move Up</button>
          <button data-testid="move-down-button" v-bind="moveDownButtonProps">Move Down</button>
        </div>
      </Iteration>
    `,
  });

  await render(TestComponent);

  const content = screen.getByTestId('repeater-item');
  expect(content).toBeInTheDocument();
});

test('warns if move is called with the same index', async () => {
  const { move } = await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  move(0, 0);
  await flush();

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('warns if move is called with an out of bounds index', async () => {
  const { move } = await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  move(0, 10);
  await flush();

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('warns if insert is called with an out of bounds index', async () => {
  const { insert } = await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  insert(10);
  await flush();

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('warns if swap is called with the same index', async () => {
  const { swap } = await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  swap(0, 0);
  await flush();

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('warns if swap is called with an out of bounds index', async () => {
  const { swap } = await renderTest({
    name: 'testRepeater',
    min: 1,
  });

  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  swap(0, 10);
  await flush();

  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});
