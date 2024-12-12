import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SiGithub, SiDiscord } from '@icons-pack/react-simple-icons'

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col mx-8 my-5">
      <div className="border-2 self-center text-center text-lg w-56">
        VRC Asset Manager
      </div>
      <div className="flex flex-col space-x-2 mt-4 text-center">
        <span className="text-lg">このアプリについて</span>
        <p className="mt-2 text-base">ほげほげ</p>
      </div>
      <div className="flex flex-col items-center space-x-2 mt-4">
        <span className="text-lg">制作陣</span>
        <div>
          <div className="flex flex-row items-center space-x-5 mt-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>siloneco</p>
              <a href="https://twitter.com/home" target="_blank">
                @siloneco
              </a>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-5 mt-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>raifa</p>
              <a href="https://twitter.com/home" target="_blank">
                @raifa
              </a>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-5 mt-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>Jankuma</p>
              <a href="https://twitter.com/home" target="_blank">
                @Jankuma
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-center space-x-2 mt-4">
        <span className="text-lg">寄付について</span>
        <p className="mt-2 text-base">
          維持費不要なので寄付は受け取りません、代わりにクリエイターに還元してください
        </p>
      </div>
      <div className="flex flex-row justify-end mt-24 space-x-8">
        <div className="flex flex-col items-center space-y-2">
          <SiGithub className="h-8 w-8" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <SiDiscord className="h-9 w-9" />
        </div>
      </div>
    </div>
  )
}

export default AboutPage
