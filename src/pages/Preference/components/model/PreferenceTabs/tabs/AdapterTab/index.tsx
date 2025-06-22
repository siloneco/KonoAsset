import { PreferenceTabIDs } from '@/pages/Preference/hook'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { FC } from 'react'

import { ImportSection } from './section/ImportSection'
import { ExportSection } from './section/ExportSection'

type Props = {
  id: PreferenceTabIDs
}

export const AdapterTab: FC<Props> = ({ id }) => {
  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="p-8 w-full h-full space-y-8">
        <ImportSection />
        <Separator className="w-full" />
        <ExportSection />
      </div>
    </TabsContent>
  )
}
