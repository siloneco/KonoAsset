import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { FC, useEffect, useState } from 'react'
import { UserProfile } from './components/UserProfile'
import { getVersion } from '@tauri-apps/api/app'
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

type Props = {
  id: PreferenceTabIDs
}

const AboutTab: FC<Props> = ({ id }) => {
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
          <div className="col-span-6 flex justify-center">
            <h1 className="text-4xl">
              KonoAsset
              <span className="ml-2 text-base text-foreground/60">
                v{version}
              </span>
            </h1>
          </div>
          <div className="col-span-1 flex justify-end">
            {/* TODO: implement */}
            {/* <Button variant="secondary">更新を確認</Button> */}
          </div>
        </div>
        <Separator className="w-[600px] mt-6" />
        <div className="mt-6 text-foreground/80">
          「このアセットにしよ！」 をもっと簡単にするための VRChat
          向けアセット管理ツール
        </div>
        <div className="w-[600px] flex flex-row mt-6">
          <div className="w-1/2 flex flex-col items-center">
            <div className="flex flex-row items-center space-x-4 mb-4">
              <Separator className="w-16" />
              <p className="text-foreground/80">関連リンク</p>
              <Separator className="w-16" />
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
            <div className="flex flex-row items-center space-x-4 mb-4">
              <Separator className="w-16" />
              <p className="text-foreground/80">変更履歴</p>
              <Separator className="w-16" />
            </div>
            <div className="flex flex-row space-x-6">
              <a
                href={`https://github.com/siloneco/KonoAsset/releases`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  <ExternalLink />
                  GitHubで見る
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex flex-row items-center space-x-4">
            <Separator className="w-52" />
            <p className="text-foreground/80">KonoAsset制作メンバー</p>
            <Separator className="w-52" />
          </div>
          <div className="flex flex-row space-x-10">
            <UserProfile
              name="siloneco"
              iconUrl="https://go.konoasset.dev/avatar/siloneco"
              xUsername="siloneco_vrc"
              githubUsername="siloneco"
            />
            <UserProfile
              name="Raifa"
              iconUrl="https://go.konoasset.dev/avatar/Raifa"
              xUsername="raifa_trtr"
              githubUsername="Raifa21"
            />
            <UserProfile
              name="じゃんくま"
              iconUrl="https://go.konoasset.dev/avatar/Jan_kuma"
              xUsername="Jan_kumaVRC"
            />
            <UserProfile
              name="ぷこるふ"
              iconUrl="https://go.konoasset.dev/avatar/pukorufu"
              xUsername="pukorufu"
              githubUsername="puk06"
            />
          </div>
          <p className="text-foreground/60">およびコントリビューターの皆さま</p>
        </div>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex flex-row items-center space-x-4">
            <Separator className="w-52" />
            <p className="text-foreground/80">支援について</p>
            <Separator className="w-52" />
          </div>
          <div className="flex flex-col items-center text-foreground/80">
            <p>
              GitHub
              におけるコントリビューションで、本プロジェクトを支援することができます
            </p>
            <p className="mt-6">金銭的な支援は受け付けていません</p>
            <p>
              KonoAssetは3Dモデルを制作するクリエイターがいて初めて役割が与えられるソフトウェアです
            </p>
            <p>
              クリエイターの方々への支援を優先していただくことが、我々にとっても励みになります
            </p>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

export default AboutTab
