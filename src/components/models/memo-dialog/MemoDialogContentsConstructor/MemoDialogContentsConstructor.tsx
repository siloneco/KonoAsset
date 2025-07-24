import { FC, Fragment } from 'react'
import { URL_REGEX } from './MemoDialogContentsConstructor.constants'

type Props = {
  children: string
}

export const MemoDialogContentsConstructor: FC<Props> = ({
  children: memo,
}) => {
  return (
    <pre className="w-full whitespace-pre-wrap text-base break-words font-sans">
      {memo.split('\n').map((line) => {
        let buffer: string[] = []

        return (
          <p className="space-x-1" key={line}>
            {line.split(' ').map((text, index) => {
              if (URL_REGEX.test(text)) {
                const linkComponent = (
                  <a
                    key={`url-${text}-${index}`}
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
                  <span key={`text-url-${index}`} className="space-x-1">
                    <span>{bufferedText}</span>
                    {linkComponent}
                  </span>
                )
              }

              buffer = [...buffer, text]

              return <Fragment key={`empty-${index}`}></Fragment>
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
