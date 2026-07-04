import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '../StarRating';

describe('StarRating', () => {
  it('renders rating value', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders null when rating is null and no onClickRate', () => {
    const { container } = render(<StarRating rating={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when rating is undefined and no onClickRate', () => {
    const { container } = render(<StarRating />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Rate button when rating is null with onClickRate', () => {
    const onClickRate = jest.fn();
    render(<StarRating rating={null} onClickRate={onClickRate} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClickRate).toHaveBeenCalled();
  });

  it('renders rate button for 0 rating with onClickRate', () => {
    const onClickRate = jest.fn();
    render(<StarRating rating={0} onClickRate={onClickRate} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders 5 stars for max rating', () => {
    const { container } = render(<StarRating rating={5} />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });
});
