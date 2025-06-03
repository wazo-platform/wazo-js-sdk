const esmModules = ['sip.js'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`,
  ],
  transform: {
    '\\.js$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
  ],
  globals: {
    fetch: global.fetch,
    window: {
      console: {},
    },
    navigator: {},
  }
};
