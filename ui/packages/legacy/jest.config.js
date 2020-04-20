module.exports = {
  testURL: 'http://zup.me',
  testRegex: '/__tests__/.*.spec.(js|jsx)$',
  setupFiles: [
    '<rootDir>/unit-test/setup.js',
  ],
  moduleNameMapper: {
    '^.+\\.(css|svg|png)$': '<rootDir>/unit-test/jest-stub.js',
    '^mocks(.*)$': '<rootDir>/stub$1',
    '^containers(.*)$': '<rootDir>/src/containers$1',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^core(.*)$': '<rootDir>/src/core$1',
    '^routes(.*)$': '<rootDir>/src/routes$1',
    '^unit-test(.*)$': '<rootDir>/unit-test$1',
  },
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 0,
      lines: 2,
      statements: 2,
    },
  },
  coverageReporters: [
    'lcov',
    'text',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  setupFilesAfterEnv: [
    '<rootDir>/unit-test/setup-files.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/unit-test/',
    '/src/core/i18n/',
    '/src/core/providers/',
    '/src/core/helpers/',
    '/stub/',
  ],
}
