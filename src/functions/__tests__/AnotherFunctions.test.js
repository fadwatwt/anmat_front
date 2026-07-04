import { convertToSlug, capitalize } from '../AnotherFunctions';

describe('convertToSlug', () => {
  it('converts text to slug', () => {
    expect(convertToSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(convertToSlug('Hello! World?')).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    expect(convertToSlug('Hello   World')).toBe('hello-world');
  });

  it('returns empty string for non-string input', () => {
    expect(convertToSlug(123)).toBe('');
    expect(convertToSlug(null)).toBe('');
    expect(convertToSlug(undefined)).toBe('');
    expect(convertToSlug({})).toBe('');
  });

  it('handles empty string', () => {
    expect(convertToSlug('')).toBe('');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('returns empty string for falsy input', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
  });

  it('only capitalizes first letter, keeps rest', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });
});
