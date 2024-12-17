import EditPage from '@/components/page/EditPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return <EditPage id={id} />
}
