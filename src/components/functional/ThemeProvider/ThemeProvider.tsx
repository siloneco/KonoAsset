import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { FC } from 'react'

type Props = React.ComponentProps<typeof NextThemesProvider>

export const ThemeProvider: FC<Props> = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
