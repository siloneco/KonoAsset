import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/misc/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { PersistentContextProvider } from '@/components/context/PersistentContext'
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
        <PersistentContextProvider>
          <LocalizationContextProvider>
            <UpdateDialogProvider>
              <DragDropContextProvider>
                <Outlet />
                <Toaster />
              </DragDropContextProvider>
            </UpdateDialogProvider>
          </LocalizationContextProvider>
        </PersistentContextProvider>
      </PreferenceContextProvider>
    </ThemeProvider>
  ),
})
