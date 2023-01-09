/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ["node_modules/(?!(sip.js))"],
  transform: {
    '\\.js$': 'babel-jest',
  },
  globals: {
    window: {
      console: {},
    },
    navigator: {},
  }
};
