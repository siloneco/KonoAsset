import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/misc/ThemeProvider'

import '../index.css'
import { Toaster } from '@/components/ui/toaster'
import PersistentContextProvider from '@/components/context/PersistentContext'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PersistentContextProvider>
        <Outlet />
        <Toaster />
      </PersistentContextProvider>
    </ThemeProvider>
  ),
})
