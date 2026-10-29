import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutForm from '../CheckoutForm';

jest.mock('@stripe/react-stripe-js', () => ({
  PaymentElement: ({ onReady, onLoadError }) => (
    <div data-testid="payment-element">
      <button type="button" onClick={() => onReady({})}>Simulate ready</button>
      <button type="button" onClick={() => onLoadError({ error: { message: 'Stripe unavailable' } })}>Simulate load error</button>
    </div>
  ),
  useStripe: () => null,
  useElements: () => null,
}));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('react-redux', () => ({ useSelector: () => ({ token: 'test-token' }) }));

describe('CheckoutForm payment field loading', () => {
  it('keeps the Stripe element mounted in a visible form while loading', () => {
    render(<CheckoutForm amount={25} />);
    const form = document.getElementById('payment-form');
    expect(form).toBeTruthy();
    expect(form.className).not.toContain('h-0');
    expect(screen.getByTestId('payment-element')).toBeTruthy();
    expect(screen.getByText('Loading secure payment...')).toBeTruthy();
  });

  it('shows a Stripe load error instead of an endless spinner', () => {
    render(<CheckoutForm amount={25} />);
    fireEvent.click(screen.getByText('Simulate load error'));
    expect(screen.getByRole('alert').textContent).toBe('Stripe unavailable');
    expect(screen.queryByText('Loading secure payment...')).toBeNull();
  });
});
