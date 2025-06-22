import { SetupPage } from '@/pages/Setup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SetupPage />
}
