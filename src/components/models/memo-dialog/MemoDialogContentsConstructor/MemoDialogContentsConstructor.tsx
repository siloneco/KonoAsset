import { FC } from 'react'
import { URL_REGEX } from './MemoDialogContentsConstructor.constants'

type Props = {
  children: string
}

export const MemoDialogContentsConstructor: FC<Props> = ({
  children: memo,
}) => {
  return (
    <pre className="w-full whitespace-pre-wrap text-base break-words font-sans">
      {memo.split('\n').map((line, lineIndex) => {
        let buffer: string[] = []

        return (
          <p className="space-x-1" key={`line-${lineIndex}`}>
            {line.split(' ').map((text, textIndex) => {
              if (URL_REGEX.test(text)) {
                const linkComponent = (
                  <a
                    key={`url-${lineIndex}-${textIndex}`}
                    href={text}
                    className="text-blue-600 dark:text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {text}
                  </a>
                )

                if (buffer.length <= 0) {
                  return linkComponent
                }

                const bufferedText = buffer.join(' ')
                buffer = []

                return (
                  <span
                    key={`text-url-${lineIndex}-${textIndex}`}
                    className="space-x-1"
                  >
                    <span>{bufferedText}</span>
                    {linkComponent}
                  </span>
                )
              }

              buffer = [...buffer, text]

              return null
            })}
            {buffer.length > 0 && (
              <span key={`buffer-${line}`}>{buffer.join(' ')}</span>
            )}
          </p>
        )
      })}
    </pre>
  )
}
