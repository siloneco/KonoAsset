import { AnimatedSetupPage } from '@/pages/AnimatedSetup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AnimatedSetupPage />
}
