// import React from 'react' がないとエラーになるため必要
// eslint-disable-next-line import-x/default
import React from 'react'

import type { Preview } from '@storybook/react'
import { ThemeProvider } from '../src/components/misc/ThemeProvider'
import { LocalizationContextProvider } from '../src/components/context/LocalizationContext'

import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, context) => {
      const { theme: themeOverride } = context.globals

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          forcedTheme={themeOverride}
          disableTransitionOnChange
        >
          <LocalizationContextProvider
            forcedLanguage={context.globals.language}
          >
            <Story />
          </LocalizationContextProvider>
        </ThemeProvider>
      )
    },
  ],
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'circlehollow', title: 'Light' },
        { value: 'dark', icon: 'circle', title: 'Dark' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
  language: {
    name: 'Language',
    description: 'Global language for components',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'en-US', icon: 'circle', title: 'English' },
        { value: 'ja-JP', icon: 'circle', title: '日本語' },
        { value: 'zh-CN', icon: 'circle', title: '简体中文' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
}

export default preview
