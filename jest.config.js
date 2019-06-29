'use strict';

module.exports = {
  roots: [
    'tests'
  ],
  verbose: false,
  testEnvironment: 'node',
  testRegex: 'tests/(.*/)*.*test.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*'
  ],
  transformIgnorePatterns: ['/node_modules/']
};
