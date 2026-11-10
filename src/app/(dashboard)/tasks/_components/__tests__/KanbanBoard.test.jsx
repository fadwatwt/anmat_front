import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../KanbanBoard';

jest.mock('@/app/providers', () => ({ useTheme: () => ['light'] }));
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div>{children}</div>,
  DragOverlay: ({ children }) => <div>{children}</div>,
  useDroppable: () => ({ setNodeRef: jest.fn(), isOver: false }),
  useSensor: jest.fn(), useSensors: jest.fn(), PointerSensor: jest.fn(), KeyboardSensor: jest.fn(),
}));
jest.mock('../KanbanTaskCard', () => ({ __esModule: true, default: ({ task }) => <div data-testid="task-card">{task.title}</div> }));

test('limits initial rendering of ten thousand tasks and progressively reveals cards', () => {
  const tasks = Array.from({ length: 10000 }, (_, index) => ({ _id: String(index), title: `Task ${index}`, status: 'open' }));
  render(<KanbanBoard tasks={tasks} />);
  expect(screen.getAllByTestId('task-card')).toHaveLength(30);
  fireEvent.click(screen.getByRole('button', { name: 'Show more cards' }));
  expect(screen.getAllByTestId('task-card')).toHaveLength(60);
});

test('does not move tasks from hidden statuses into open or crash when open is hidden', () => {
  const tasks = [{ _id: 'a', title: 'Visible', status: 'done' }, { _id: 'b', title: 'Hidden', status: 'open' }];
  render(<KanbanBoard tasks={tasks} allowedColumns={['done']} />);
  expect(screen.getAllByTestId('task-card')).toHaveLength(1);
  expect(screen.queryByText('Hidden')).toBeNull();
});
