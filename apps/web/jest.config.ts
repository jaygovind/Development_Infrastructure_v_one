import type { Config } from 'jest';
const config: Config = {
  displayName: 'web',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
  moduleFileExtensions: ['ts','tsx','js','jsx'],
  roots: ['<rootDir>'],
  coverageDirectory: '../../coverage/apps/web',
  passWithNoTests: true
};
export default config;
