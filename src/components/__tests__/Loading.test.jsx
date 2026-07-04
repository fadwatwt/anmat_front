import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Loading className="mt-4" />);
    expect(container.firstChild.className).toContain('mt-4');
  });

  it('renders with custom size', () => {
    const { container } = render(<Loading size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
