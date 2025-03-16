module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
};