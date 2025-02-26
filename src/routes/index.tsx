import DragDropContextProvider from '@/components/context/DragDropContext'
import LoadErrorPage from '@/components/page/LoadError'
import TopPage from '@/components/page/Top'
import { commands } from '@/lib/bindings'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    const result = await commands.requireInitialSetup()
    if (result.status === 'ok' && result.data) {
      throw redirect({
        to: '/setup',
      })
    }

    return await commands.getLoadStatus()
  },
  gcTime: 0,
  component: RouteComponent,
})

function RouteComponent() {
  const result = Route.useLoaderData()

  if (result.success) {
    return (
      <DragDropContextProvider>
        <TopPage />
      </DragDropContextProvider>
    )
  }

  return (
    <LoadErrorPage
      preferenceLoaded={result.preferenceLoaded}
      error={result.message as string}
    />
  )
}
