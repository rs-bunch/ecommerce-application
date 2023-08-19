/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/tests/setup/matchMedia.js'],
  moduleNameMapper: {
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '^.+\\.html?$': './src/tests/utils/text.loader.js',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
};
