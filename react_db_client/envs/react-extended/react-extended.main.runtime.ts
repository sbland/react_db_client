import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { ReactExtendedAspect } from './react-extended.aspect';
//import {
//  previewConfigTransformer,
//  devServerConfigTransformer
//} from './webpack/webpack-transformers';
//import {
//  devConfigTransformer,
//  buildConfigTransformer,
//} from "./typescript/ts-transformer";

export class ReactExtendedMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  //const webpackModifiers: UseWebpackModifiers = {
  //  previewConfig: [previewConfigTransformer],
  //  devServerConfig: [devServerConfigTransformer],
  //};

  //const tsModifiers: UseTypescriptModifiers = {
  //  devConfig: [devConfigTransformer],
  //  buildConfig: [buildConfigTransformer],
  //};

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    const ReactExtendedEnv = react.compose([
      /**
       * Uncomment to override the config files for TypeScript, Webpack or Jest
       * Your config gets merged with the defaults
       */

      // react.useTypescript(tsModifiers),  // note: this cannot be used in conjunction with react.overrideCompiler
      // react.useWebpack(webpackModifiers),
      // react.overrideJestConfig(require.resolve('./jest/jest.config')),

      /**
       * override the ESLint default config here then check your files for lint errors
       * @example
       * bit lint
       * bit lint --fix
       */
      react.useEslint({
        transformers: [
          (config) => {
            // NOTE: Plugins must be added manually currently.
            config.raw.config.overrideConfig.plugins = ['react-hooks'];
            // config.addExtends(['prettier']);
            config.setRule('react-hooks/rules-of-hooks', 'error');
            config.setRule('react-hooks/exhaustive-deps', 'warn');
            // config.setRule('prettier/prettier', 'error');
            return config;
          },
        ],
      }),

      /**
       * override the Prettier default config here the check your formatting
       * @example
       * bit format --check
       * bit format
       */
      react.usePrettier({
        transformers: [
          (config) => {
            config.setKey('tabWidth', 2);
            return config;
          },
        ],
      }),

      /**
       * override dependencies here
       * @example
       * Uncomment types to include version 17.0.3 of the types package
       */
      react.overrideDependencies({
        devDependencies: {
          // '@types/react': '17.0.3'
        },
      }),
    ]);
    envs.registerEnv(ReactExtendedEnv);
    return new ReactExtendedMain();
  }
}

ReactExtendedAspect.addRuntime(ReactExtendedMain);