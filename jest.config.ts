import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  projects: [
    {
      displayName: 'Unit',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: 'src',
      testRegex: '.spec.ts$',
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            compiler: 'ttypescript',
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      setupFiles: ['dotenv-mono/load', 'jest-ts-auto-mock'],
      moduleDirectories: ['node_modules', __dirname],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
      preset: 'ts-jest',
      setupFilesAfterEnv: ['../jest.setup.js'],
    },
    {
      displayName: 'E2E',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: 'test',
      testRegex: '.spec.ts$',
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            compiler: 'ttypescript',
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      setupFiles: ['dotenv-mono/load', 'jest-ts-auto-mock'],
      moduleDirectories: ['node_modules', __dirname],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
      preset: 'ts-jest',
      setupFilesAfterEnv: ['../jest.setup.js'],
    },
  ],
};
