import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // 2025年12月時点で、storycap が Storybook 10 に対応していない & そもそも1月からメンテナンスされていないため、無効化
    // 'storycap',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
export default config
