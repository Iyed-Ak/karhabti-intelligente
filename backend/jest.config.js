module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000
};