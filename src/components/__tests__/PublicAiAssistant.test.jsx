import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PublicAiAssistant from '../PublicAiAssistant';

jest.mock('@/components/MarkdownRenderer', () => function Markdown({ content }) {
  return <span>{content}</span>;
});

describe('PublicAiAssistant', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => jest.restoreAllMocks());

  it('discloses AI use and sends only public chat context', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { response: 'Anmaat answer', suggestSupport: false } }),
    });
    render(<PublicAiAssistant />);

    fireEvent.click(screen.getByRole('button', { name: 'Open Anmaat AI assistant' }));
    expect(screen.getByText(/You are chatting with an AI assistant/)).toBeInTheDocument();

    const input = screen.getByLabelText('Ask about Anmaat…');
    fireEvent.change(input, { target: { value: 'What does Anmaat do?' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0][0]).toContain('/api/public/ai/chat');
    const request = JSON.parse(fetch.mock.calls[0][1].body);
    expect(request).toEqual({ message: 'What does Anmaat do?', history: [], lang: 'en' });
    expect(await screen.findByText('Anmaat answer')).toBeInTheDocument();
  });

  it('offers support and registration when the public model cannot answer', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { response: 'Please contact support.', suggestSupport: true } }),
    });
    render(<PublicAiAssistant />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Anmaat AI assistant' }));
    const input = screen.getByLabelText('Ask about Anmaat…');
    fireEvent.change(input, { target: { value: 'I need account help' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(await screen.findByRole('link', { name: 'Contact support' })).toHaveAttribute('href', 'mailto:support@anmat.com');
    expect(screen.getAllByRole('link', { name: 'Create account' })[0]).toHaveAttribute('href', '/register/subscriber/email');
  });

  it('retries a transient failure without adding the error or duplicate question to AI history', async () => {
    fetch
      .mockRejectedValueOnce(new Error('Provider unavailable'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { response: 'Hello! How can I help with Anmaat?', suggestSupport: false } }),
      });
    render(<PublicAiAssistant />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Anmaat AI assistant' }));
    const input = screen.getByLabelText('Ask about Anmaat…');
    fireEvent.change(input, { target: { value: 'hi' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Hello! How can I help with Anmaat?')).toBeInTheDocument();
    const retryRequest = JSON.parse(fetch.mock.calls[1][1].body);
    expect(retryRequest).toEqual({ message: 'hi', history: [], lang: 'en' });
  });
});
