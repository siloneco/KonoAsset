import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { FC } from 'react'

type Props = {
  name: string
  iconUrl: string

  xUsername?: string
  githubUsername?: string
}

export const UserProfile: FC<Props> = ({
  name,
  iconUrl,
  xUsername,
  githubUsername,
}) => {
  return (
    <div className="flex flex-row items-center space-x-4">
      <Avatar>
        <AvatarImage src={iconUrl} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p>{name}</p>
        <div className="flex flex-row space-x-2">
          {xUsername && (
            <a
              href={`https://x.com/${xUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiX size={20} />
            </a>
          )}
          {githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
