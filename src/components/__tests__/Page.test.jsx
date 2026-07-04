import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../Page';

jest.mock('../Breadcrumbs', () => {
  return function MockBreadcrumbs({ breadcrumbs }) {
    return <div data-testid="breadcrumbs">{breadcrumbs.length} items</div>;
  };
});

describe('Page', () => {
  it('renders children and title', () => {
    render(<Page title="Test Title"><p>Content</p></Page>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('hides title when isTitle is false', () => {
    render(<Page isTitle={false}><p>Content</p></Page>);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders button when isBtn is true', () => {
    render(<Page title="Title" isBtn btnTitle="Add New"><p>Content</p></Page>);
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('renders breadcrumbs when isBreadcrumbs is true', () => {
    const breadcrumbs = [{ title: 'Home', path: '/' }];
    render(<Page title="Title" isBreadcrumbs breadcrumbs={breadcrumbs}><p>Content</p></Page>);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders navigation text when isNavs is true', () => {
    render(<Page title="Title" isNavs><p>Content</p></Page>);
    expect(screen.getByText('Dashboard / Notifications')).toBeInTheDocument();
  });

  it('renders otherHeaderActions', () => {
    render(
      <Page title="Title" otherHeaderActions={<button>Custom Action</button>}>
        <p>Content</p>
      </Page>
    );
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Page title="Title" className="custom-class"><p>Content</p></Page>);
    expect(container.firstChild.className).toContain('custom-class');
  });
});
