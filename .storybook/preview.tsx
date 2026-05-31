import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/functional/ThemeProvider'
import { LocalizationContextProvider } from '../src/components/context/LocalizationContext'

import { theme, language } from './default-global-types.json'

import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
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
    defaultValue: theme,
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
    defaultValue: language,
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'en-US', icon: 'circle', title: 'English (US)' },
        { value: 'en-GB', icon: 'circle', title: 'English (UK)' },
        { value: 'ja-JP', icon: 'circle', title: '日本語' },
        { value: 'zh-CN', icon: 'circle', title: '简体中文' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
}

export default preview
