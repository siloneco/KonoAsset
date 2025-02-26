import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/misc/ThemeProvider'

import '../index.css'
import { Toaster } from '@/components/ui/toaster'
import PersistentContextProvider from '@/components/context/PersistentContext'
import PreferenceContextProvider from '@/components/context/PreferenceContext'
import { LocalizationContextProvider } from '@/components/context/LocalizationContext'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PreferenceContextProvider>
        <PersistentContextProvider>
          <LocalizationContextProvider>
            <Outlet />
            <Toaster />
          </LocalizationContextProvider>
        </PersistentContextProvider>
      </PreferenceContextProvider>
    </ThemeProvider>
  ),
})
