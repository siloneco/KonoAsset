import { LoadErrorPage } from '@/page/LoadError'
import { TopPage } from '@/page/Top'
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
    return <TopPage />
  }

  const error = result.message !== null ? result.message : 'Unknown error'

  return (
    <LoadErrorPage preferenceLoaded={result.preferenceLoaded} error={error} />
  )
}
