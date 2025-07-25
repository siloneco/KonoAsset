import { PreferencePage } from '@/pages/Preference'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preference')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PreferencePage />
}
