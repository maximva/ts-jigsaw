import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    ".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub"
  },
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['**/lib/**/*.{js,ts}'],
  setupFiles: [
    "jest-canvas-mock"
  ],
};

export default config;
