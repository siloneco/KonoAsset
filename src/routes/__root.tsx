import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/misc/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { PreferenceContextProvider } from '@/components/context/PreferenceContext'
import { LocalizationContextProvider } from '@/components/context/LocalizationContext'
import { UpdateDialogProvider } from '@/components/context/UpdateDialogContext'
import { DragDropContextProvider } from '@/components/context/DragDropContext'

import '../index.css'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PreferenceContextProvider>
        <LocalizationContextProvider>
          <UpdateDialogProvider>
            <DragDropContextProvider>
              <Outlet />
              <Toaster />
            </DragDropContextProvider>
          </UpdateDialogProvider>
        </LocalizationContextProvider>
      </PreferenceContextProvider>
    </ThemeProvider>
  ),
})
