import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  const breadcrumbs = [
    { title: 'Home', path: '/' },
    { title: 'Dashboard', path: '/dashboard' },
    { title: 'Current Page' },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders links for items with path', () => {
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/dashboard');
  });

  it('renders 3 li elements for 3 items (separators are not wrapped in li)', () => {
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  it('handles single breadcrumb', () => {
    render(<Breadcrumbs breadcrumbs={[{ title: 'Alone' }]} />);
    expect(screen.getByText('Alone')).toBeInTheDocument();
  });
});
