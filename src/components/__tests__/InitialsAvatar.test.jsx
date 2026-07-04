import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import InitialsAvatar from '../InitialsAvatar';

describe('InitialsAvatar', () => {
  it('renders initials from two-part name', () => {
    render(<InitialsAvatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders first two chars for single name', () => {
    render(<InitialsAvatar name="John" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders "??" for empty name', () => {
    render(<InitialsAvatar name="" />);
    expect(screen.getByText('??')).toBeInTheDocument();
  });

  it('renders "??" for undefined name', () => {
    render(<InitialsAvatar />);
    expect(screen.getByText('??')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<InitialsAvatar name="Jane Doe" size="100px" />);
    const div = container.firstChild;
    expect(div).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('applies custom className', () => {
    const { container } = render(<InitialsAvatar name="Test User" className="bg-red-500" />);
    const div = container.firstChild;
    expect(div.className).toContain('bg-red-500');
  });

  it('generates consistent color for same name', () => {
    const { container: c1 } = render(<InitialsAvatar name="Alice Johnson" />);
    const { container: c2 } = render(<InitialsAvatar name="Alice Johnson" />);
    expect(c1.firstChild.className).toBe(c2.firstChild.className);
  });
});
