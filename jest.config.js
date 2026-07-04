module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': ['@swc/jest', {
      jsc: {
        parser: { jsx: true },
        transform: { react: { runtime: 'automatic' } },
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.test.(js|jsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
