/* global jest, describe, it, expect */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MessageInput from '../MessageInput';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('emoji-picker-react', () => () => null);
jest.mock('lucide-react', () => ({
  Send: () => null,
  Paperclip: () => null,
  Smile: () => null,
  Edit3: () => null,
  X: () => null,
  BarChart2: () => null,
  FileIcon: () => null,
  ImageIcon: () => null,
}));
jest.mock('@/redux/conversations/conversationsAPI', () => ({
  useUploadFileMutation: () => [jest.fn()],
}));

const renderInput = (onSendMessage) => render(
  <MessageInput
    onSendMessage={onSendMessage}
    onTyping={jest.fn()}
    editMessageData={null}
    onCancelEdit={jest.fn()}
    onEditMessage={jest.fn()}
    onOpenPoll={jest.fn()}
    activeChatId="chat-1"
  />
);

describe('MessageInput', () => {
  it('keeps the draft and displays an error when delivery fails', async () => {
    const onSendMessage = jest.fn().mockRejectedValue(new Error('Disconnected'));
    const { container } = renderInput(onSendMessage);
    const input = screen.getByPlaceholderText('Type a message...');

    fireEvent.change(input, { target: { value: 'Please keep this draft' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong'));
    expect(input).toHaveValue('Please keep this draft');
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('clears the draft only after the server confirms delivery', async () => {
    let confirmDelivery;
    const onSendMessage = jest.fn().mockImplementation(() => new Promise((resolve) => {
      confirmDelivery = resolve;
    }));
    const { container } = renderInput(onSendMessage);
    const input = screen.getByPlaceholderText('Type a message...');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(container.querySelector('form'));

    expect(input).toHaveValue('Hello');
    confirmDelivery({ _id: 'message-1' });
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
