import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ReadMore from '../ReadMore';

describe('ReadMore', () => {
  it('renders short content without toggle', () => {
    const { container } = render(<ReadMore>Short</ReadMore>);
    expect(container.textContent).toContain('Short');
    expect(screen.queryByText('Read More')).not.toBeInTheDocument();
  });

  it('renders toggle for long content', () => {
    const longText = 'A'.repeat(100);
    render(<ReadMore maxLength={10}>{longText}</ReadMore>);
    expect(screen.getByText('Read More')).toBeInTheDocument();
  });

  it('expands content on clicking Read More', () => {
    const longText = 'A'.repeat(100);
    render(<ReadMore maxLength={10}>{longText}</ReadMore>);
    fireEvent.click(screen.getByText('Read More'));
    expect(screen.getByText('Read Less')).toBeInTheDocument();
  });

  it('shows ellipsis for truncated content', () => {
    const longText = 'A'.repeat(100);
    render(<ReadMore maxLength={10}>{longText}</ReadMore>);
    const contentEl = screen.getByText((content) => content.includes('...'));
    expect(contentEl).toBeInTheDocument();
  });

  it('renders htmlContent safely', () => {
    render(<ReadMore htmlContent="<b>Bold</b>" maxLength={50} />);
    expect(screen.getByText('Bold')).toBeInTheDocument();
  });

  it('respects custom maxLength', () => {
    const text = 'Hello World';
    render(<ReadMore maxLength={5}>{text}</ReadMore>);
    expect(screen.getByText((content) => content.includes('...'))).toBeInTheDocument();
  });
});
