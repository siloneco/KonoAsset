import LoadErrorPage from '@/components/page/LoadError'
import TopPage from '@/components/page/Top'
import { commands } from '@/lib/bindings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
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

  return (
    <LoadErrorPage
      preferenceLoaded={result.preferenceLoaded}
      error={result.message as string}
    />
  )
}
