// Override the Jest config to ignore transpiling from specific folders
// See the base Jest config: https://bit.cloud/teambit/react/react/~code/jest/jest.config.js

const reactJestConfig = require('@teambit/react/jest/jest.config');
const cjsTransformer = require.resolve('@teambit/react/jest/transformers/cjs-transformer.js');
// uncomment the line below and install the package if you want to use this function
// const {
//   generateNodeModulesPattern,
// } = require('@teambit/dependencies.modules.packages-excluder');
// const packagesToExclude = ['@my-org', 'my-package-name'];

module.exports = {
  ...reactJestConfig,
  transformIgnorePatterns: ['^.+.module.(css|sass|scss)$'],
  transform: {
    ...reactJestConfig.transform,
    '^.+\\.(cjs)$': cjsTransformer
  },
  testEnvironment: 'jsdom',
};
