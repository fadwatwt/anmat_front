import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../Modal';

let mockAlertOpen = false;

jest.mock('@/store/alertStore', () => ({
  useIsAlertOpen: () => mockAlertOpen,
}));

jest.mock('../../Form/DefaultButton', () => {
  return function MockButton({ title, onClick, type, className }) {
    return <button type={type} onClick={onClick} className={className}>{title}</button>;
  };
});

describe('Modal', () => {
  it('traps focus, closes on Escape, and restores the opener', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const onClose = jest.fn();
    const { unmount, rerender } = render(<Modal isOpen onClose={onClose}><button>First</button><button>Last</button></Modal>);
    expect(screen.getByText('First')).toHaveFocus();
    screen.getByText('Last').focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByText('First')).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(screen.getByText('Last')).toHaveFocus();
    rerender(<Modal isOpen onClose={() => onClose()}><button>First</button><button>Last</button></Modal>);
    expect(screen.getByText('Last')).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });
  it('returns null when isOpen is false', () => {
    const { container } = render(<Modal isOpen={false}><p>Content</p></Modal>);
    expect(container.firstChild).toBeNull();
  });

  it('renders content when isOpen is true', () => {
    render(<Modal isOpen={true}><p>Modal Content</p></Modal>);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal isOpen={true} title="Test Modal"><p>Content</p></Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders close button when title exists', () => {
    render(<Modal isOpen={true} title="Test"><p>Content</p></Modal>);
    const closeBtn = document.querySelector('button');
    expect(closeBtn).toBeInTheDocument();
  });

  it('does not render title section when no title', () => {
    render(<Modal isOpen={true}><p>Content</p></Modal>);
    const headings = screen.queryByRole('heading');
    expect(headings).toBeNull();
  });

  it('renders action buttons when isBtns is true', () => {
    render(<Modal isOpen={true} isBtns title="Test"><p>Content</p></Modal>);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders custom button title', () => {
    render(<Modal isOpen={true} isBtns btnApplyTitle="Save" title="Test"><p>Content</p></Modal>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('hides cancel button when isHideCancel is true', () => {
    render(<Modal isOpen={true} isBtns isHideCancel title="Test"><p>Content</p></Modal>);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders custom buttons', () => {
    render(<Modal isOpen={true} customBtns={<button>Custom Btn</button>} title="Test"><p>Content</p></Modal>);
    expect(screen.getByText('Custom Btn')).toBeInTheDocument();
  });

  it('hides modal when alert is open', () => {
    mockAlertOpen = true;
    render(<Modal isOpen={true}><p>Content</p></Modal>);
    expect(screen.getByRole('dialog')).toHaveClass('hidden');
    mockAlertOpen = false;
  });
});
