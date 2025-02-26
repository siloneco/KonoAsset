import { SetupPage } from '@/components/page/Setup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SetupPage />
}
