import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { TabsContent } from '@/components/ui/tabs'
import { Construction } from 'lucide-react'
import { FC } from 'react'

type Props = {
  id: PreferenceTabIDs
}

const LogsTab: FC<Props> = ({ id }) => {
  return (
    <TabsContent value={id} className="mt-0 w-full h-full">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-2xl">未実装</h1>
        <p className="flex flex-row items-center text-foreground/60">
          <Construction className="mr-2" />
          Under Construction
        </p>
      </div>
    </TabsContent>
  )
}

export default LogsTab
