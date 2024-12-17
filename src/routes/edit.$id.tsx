import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return <p>{id}</p>
}
