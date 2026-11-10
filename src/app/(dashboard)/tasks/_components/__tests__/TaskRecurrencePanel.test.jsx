import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskRecurrencePanel from '../../[slug]/details/TaskRecurrencePanel';

const configure = jest.fn();
const stop = jest.fn();
jest.mock('@/redux/tasks/subscriberTasksApi', () => ({
  useGetTaskRecurrencesQuery: () => ({ data: [{ source_task_id: 'task', active: true, next_run_at: '2026-12-01' }] }),
  useConfigureTaskRecurrenceMutation: () => [configure, { isLoading: false }],
  useStopTaskRecurrenceMutation: () => [stop, { isLoading: false }],
}));
beforeEach(() => { configure.mockReset().mockReturnValue({ unwrap: async () => ({}) }); stop.mockReset().mockReturnValue({ unwrap: async () => ({}) }); });

test.each(['daily', 'weekly', 'monthly'])('saves a %s recurrence with the selected dates', async (cadence) => {
  render(<TaskRecurrencePanel taskId="task" />);
  fireEvent.change(screen.getByLabelText('Repeat every'), { target: { value: cadence } });
  fireEvent.change(screen.getByLabelText('Interval'), { target: { value: '2' } });
  fireEvent.change(screen.getByLabelText('First occurrence'), { target: { value: '2026-12-01' } });
  fireEvent.change(screen.getByLabelText('Repeat until (optional)'), { target: { value: '2026-12-31' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save recurrence' }));
  await screen.findByText('Recurring task saved');
  expect(configure).toHaveBeenCalledWith({ taskId: 'task', cadence, interval: 2, first_occurrence: '2026-12-01', until: '2026-12-31' });
});
test('does not claim a failed stop succeeded', async () => {
  stop.mockReturnValue({ unwrap: async () => { throw { data: { message: 'Stop failed' } }; } });
  render(<TaskRecurrencePanel taskId="task" />);
  fireEvent.click(screen.getByRole('button', { name: 'Stop recurrence' }));
  await screen.findByText('Stop failed');
  expect(screen.queryByText('Recurring task stopped')).toBeNull();
});
test('blocks a recurrence whose end precedes its start', async () => {
  render(<TaskRecurrencePanel taskId="task" />);
  fireEvent.change(screen.getByLabelText('First occurrence'), { target: { value: '2026-12-31' } });
  fireEvent.change(screen.getByLabelText('Repeat until (optional)'), { target: { value: '2026-12-01' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save recurrence' }));
  await waitFor(() => expect(configure).not.toHaveBeenCalled());
});
