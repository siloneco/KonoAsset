import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

import TypeSelector from './components/TypeSelector'
import AvatarWearableFilter from './layout/AvatarWearableFilter'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useContext, useEffect, useState } from 'react'
import WorldObjectFilter from './layout/WorldObjectFilter'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { Option } from '@/components/ui/multi-select'
import { fetchAllTags } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from '@tanstack/react-router'
import { Route as PreferenceRoute } from '@/routes/preference'
import TextSearch from './components/TextSearch'
import { useLocalization } from '@/hooks/use-localization'

const MainSidebar = () => {
  const navigate = useNavigate()
  const {
    assetType,
    queryTextMode,
    setQueryTextMode,
    generalQueryTextFilter,
    setGeneralQueryTextFilter,
    queryTextFilterForName,
    setQueryTextFilterForName,
    queryTextFilterForCreator,
    setQueryTextFilterForCreator,
    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,
  } = useContext(PersistentContext)

  const [tagCandidates, setTagCandidates] = useState<Option[]>([])
  const tagValues: Option[] = tagFilter.map((tag) => ({
    value: tag,
    label: tag,
  }))

  const updateCategoriesAndTags = async () => {
    setTagCandidates(await fetchAllTags())
  }
  const { t } = useLocalization()

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

  return (
    <Sidebar collapsible="none" className="w-80 border-r-2">
      <SidebarContent>
        <ScrollArea className="h-screen">
          <div className="flex flex-row items-center m-4 mr-0">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
            <div className="text-xl ml-2">KonoAsset</div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto mr-2 flex relative"
              onClick={() => navigate({ to: PreferenceRoute.to })}
            >
              <Settings />
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent className="p-2">
              <TextSearch
                mode={queryTextMode}
                setMode={setQueryTextMode}
                general={generalQueryTextFilter}
                setGeneral={setGeneralQueryTextFilter}
                name={queryTextFilterForName}
                setName={setQueryTextFilterForName}
                creator={queryTextFilterForCreator}
                setCreator={setQueryTextFilterForCreator}
              />
              <Label className="text-base">{t('mainsidebar:asset-type')}</Label>
              <TypeSelector />
              {(assetType === 'All' || assetType === 'AvatarWearable') && (
                <AvatarWearableFilter />
              )}
              {assetType === 'WorldObject' && <WorldObjectFilter />}
              <div className="mt-4">
                <MultiFilterItemSelector
                  label={t('general:tag')}
                  placeholder={t('mainsidebar:filter:tag:placeholder')}
                  candidates={tagCandidates}
                  value={tagValues}
                  onValueChange={(values) =>
                    setTagFilter(values.map((v) => v.value))
                  }
                  matchType={tagFilterMatchType}
                  setMatchType={setTagFilterMatchType}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

export default MainSidebar
