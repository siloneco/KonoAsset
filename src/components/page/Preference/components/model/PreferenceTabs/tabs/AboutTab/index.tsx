import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { FC, useEffect, useState } from 'react'
import { UserProfile } from './components/UserProfile'
import { getVersion } from '@tauri-apps/api/app'
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  id: PreferenceTabIDs
}

const AboutTab: FC<Props> = ({ id }) => {
  const { t } = useLocalization()
  const [version, setVersion] = useState('X.X.X')

  useEffect(() => {
    const getAndSetVersion = async () => {
      const v = await getVersion()
      setVersion(v)
    }

    getAndSetVersion()
  }, [])

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="w-full py-8 flex flex-col items-center">
        <div className="grid grid-cols-8 w-[600px]">
          <div className="col-span-1" />
          <div className="col-span-6 flex justify-center items-center">
            <img src="/logo.png" className="w-12 h-12" />
            <h1 className="text-4xl ml-2">
              KonoAsset
              <span className="ml-2 text-base text-muted-foreground">
                v{version}
              </span>
            </h1>
          </div>
          <div className="col-span-1 flex justify-end">
            {/* TODO: implement */}
            {/* <Button variant="secondary">更新を確認</Button> */}
          </div>
        </div>
        <div className="w-[600px] mt-6">
          <Separator />
        </div>
        <div className="mt-6 text-foreground">
          {t('preference:about:description')}
        </div>
        <div className="w-[600px] flex flex-row mt-6">
          <div className="w-1/2 flex flex-col items-center">
            <div className="flex flex-row items-center space-x-4 mb-4 w-[280px]">
              <Separator className="flex shrink" />
              <p className="text-foreground flex shrink-0">
                {t('preference:about:related-links')}
              </p>
              <Separator className="flex shrink" />
            </div>
            <div className="flex flex-row space-x-6">
              <a
                href={`https://go.konoasset.dev/github`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub size={32} />
              </a>
              <a
                href={`https://go.konoasset.dev/discord`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord size={32} />
              </a>
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <div className="flex flex-row items-center space-x-4 mb-4 w-[280px]">
              <Separator className="flex shrink" />
              <p className="text-foreground flex shrink-0">
                {t('preference:about:changes')}
              </p>
              <Separator className="flex shrink" />
            </div>
            <div className="flex flex-row space-x-6">
              <a
                href={`https://github.com/siloneco/KonoAsset/blob/develop/CHANGELOG.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  <ExternalLink />
                  {t('preference:about:changes-github')}
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex flex-row items-center space-x-4 w-[600px]">
            <Separator className="flex shrink" />
            <p className="text-foreground text-nowrap flex shrink-0">
              {t('preference:about:members')}
            </p>
            <Separator className="flex shrink" />
          </div>
          <div className="flex flex-row space-x-10">
            <UserProfile
              name="siloneco"
              iconUrl="https://media.konoasset.dev/avatar/siloneco.jpg"
              xUsername="siloneco_vrc"
              githubUsername="siloneco"
            />
            <UserProfile
              name="Raifa"
              iconUrl="https://media.konoasset.dev/avatar/Raifa.jpg"
              xUsername="raifa_trtr"
              githubUsername="Raifa21"
            />
            <UserProfile
              name="じゃんくま"
              iconUrl="https://media.konoasset.dev/avatar/Jan_kuma.jpg"
              xUsername="Jan_kumaVRC"
            />
            <UserProfile
              name="ぷこるふ"
              iconUrl="https://media.konoasset.dev/avatar/pukorufu.jpg"
              xUsername="pukorufu"
              githubUsername="puk06"
            />
          </div>
          <p className="text-muted-foreground">
            {t('preference:about:extra-members-text')}
          </p>
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex flex-row items-center space-x-4 w-[600px]">
            <Separator className="flex shrink" />
            <p className="text-foreground flex shrink-0">
              {t('preference:about:support')}
            </p>
            <Separator className="flex shrink" />
          </div>
          <div className="flex flex-col items-center text-muted-foreground">
            <p>{t('preference:about:support-text-1')}</p>
            <p className="mt-6">{t('preference:about:support-text-2')}</p>
            <p>{t('preference:about:support-text-3')}</p>
            <p>{t('preference:about:support-text-4')}</p>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

export default AboutTab
