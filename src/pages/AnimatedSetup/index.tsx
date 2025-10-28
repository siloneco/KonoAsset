import { FC } from 'react'
import { Card } from '@/components/ui/card'

import './animations.css'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AppearanceTab } from './tabs/AppearanceTab'
import { Pagination } from './components/Pagination/Pagination'
import { DataPathSelectPath } from './tabs/DataPathSelectTab'
import { OtherPreferenceTab } from './tabs/OtherPreferenceTab'
import { getTabContentStyle } from './logic'
import { useAnimatedSetup } from './hook'

export type TabType = 'appearance' | 'path' | 'details'

export const AnimatedSetupPage: FC = () => {
  const { tab, handleTabChange, getTabContentStyleProps } = useAnimatedSetup()

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center px-10 bg-background selection:bg-primary selection:text-primary-foreground [view-transition-name:main-content]">
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="KonoAsset Logo"
          className="size-20 select-none"
          style={{
            animation: 'slide-in-bottom 0.7s cubic-bezier(0.4, 0, 0.2, 1) both',
          }}
        />
        <h1
          className="text-5xl text-foreground/80 dark:text-foreground"
          style={{
            animation:
              'slide-in-right 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both',
          }}
        >
          KonoAsset
        </h1>
      </div>
      <div
        // h-0 はアニメーションで上書きするので問題ない
        className="h-0 w-full overflow-hidden flex flex-col items-center mt-8"
        style={{
          animation:
            'expand-card-height 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2s forwards',
        }}
      >
        <Card
          // アニメーションが崩れず動作するために relative は必要
          className="w-[800px] px-8 py-6 h-100 overflow-hidden relative"
        >
          <Tabs
            value={tab}
            onValueChange={(value) => handleTabChange(value as TabType)}
            // アニメーションが崩れず動作するために relative は必要
            className="size-full relative"
          >
            <TabsContent
              value="appearance"
              className="size-full"
              style={getTabContentStyle({
                tabValue: 'appearance',
                ...getTabContentStyleProps,
              })}
            >
              <AppearanceTab nextTab={() => handleTabChange('path')} />
            </TabsContent>
            <TabsContent
              value="path"
              className="size-full"
              style={getTabContentStyle({
                tabValue: 'path',
                ...getTabContentStyleProps,
              })}
            >
              <DataPathSelectPath
                previousTab={() => handleTabChange('appearance')}
                nextTab={() => handleTabChange('details')}
              />
            </TabsContent>
            <TabsContent
              value="details"
              className="size-full"
              style={getTabContentStyle({
                tabValue: 'details',
                ...getTabContentStyleProps,
              })}
            >
              <OtherPreferenceTab previousTab={() => handleTabChange('path')} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <Pagination
        currentTab={tab}
        setTab={handleTabChange}
        animationCSSProperties="expand-dot-height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 2s forwards"
      />
    </div>
  )
}
