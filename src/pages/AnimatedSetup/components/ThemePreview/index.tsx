import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { FC } from 'react'

type Props = {
  theme: 'light' | 'dark'
  className?: string
  onClick?: () => void
}

type ThemeColors = {
  background: string
  foreground: string
  secondary: string
  card: string
  cardForeground: string
  primary: string
  border: string
  avatar: string
  avatarWearable: string
  worldObject: string
  otherAsset: string
  accent: string
  sidebar: string
}

const themeColors = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    secondary: 'hsl(240 4.8% 95.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(240 10% 3.9%)',
    primary: 'hsl(346.8 71% 60%)',
    border: 'hsl(240 5.9% 90%)',
    avatar: 'hsl(346.8 71% 60%)',
    avatarWearable: 'hsl(48 100% 49%)',
    worldObject: 'hsl(196 100% 50%)',
    otherAsset: 'hsl(0, 0%, 87%)',
    accent: 'hsl(240 4.8% 95.9%)',
    sidebar: 'hsl(0 0% 98%)',
  },
  dark: {
    background: 'hsl(20 14.3% 4.1%)',
    foreground: 'hsl(0 0% 95%)',
    secondary: 'hsl(240 3.7% 15.9%)',
    card: 'hsl(24 9.8% 10%)',
    cardForeground: 'hsl(0 0% 95%)',
    primary: 'hsl(346.8 50.2% 49.8%)',
    border: 'hsl(240 3.7% 15.9%)',
    avatar: 'hsl(346.8 71% 60%)',
    avatarWearable: 'hsl(39 100% 41%)',
    worldObject: 'hsl(202 100% 41%)',
    otherAsset: 'hsl(0, 0%, 33%)',
    accent: 'hsl(12 6.5% 15.1%)',
    sidebar: 'hsl(240 5.9% 10%)',
  },
}

export const ThemePreview: FC<Props> = ({ theme, className, onClick }) => {
  const colors = themeColors[theme]

  return (
    <div
      className={cn(
        'flex flex-row h-32 w-full rounded-lg border-2 overflow-hidden select-none',
        { 'cursor-pointer': onClick !== undefined },
        className,
      )}
      style={{
        backgroundColor: colors.background,
      }}
      onClick={onClick}
    >
      <SidebarPreview colors={colors} />
      <div className="h-full w-full p-2">
        <ColorPalettePreview colors={colors} />
        <div className="flex flex-row gap-2">
          <CardPreview colors={colors} typeColor={colors.avatar} />
          <CardPreview colors={colors} typeColor={colors.avatarWearable} />
          <CardPreview colors={colors} typeColor={colors.worldObject} />
          <CardPreview colors={colors} typeColor={colors.otherAsset} />
        </div>
      </div>
    </div>
  )
}

const SidebarPreview: FC<{ colors: ThemeColors }> = ({ colors }) => {
  return (
    <div
      className="w-16 h-full p-2 flex flex-col gap-2 justify-between border-r"
      style={{ backgroundColor: colors.sidebar, borderColor: colors.border }}
    >
      <div className="space-y-2">
        <div
          className="h-2 w-full rounded-xs"
          style={{
            backgroundColor: colors.primary,
          }}
        />
        <div className="space-y-1">
          <div
            className="h-1 w-6 rounded-full opacity-60"
            style={{
              backgroundColor: colors.foreground,
            }}
          />
          <div
            className="h-1 w-8 rounded-full opacity-60"
            style={{
              backgroundColor: colors.foreground,
            }}
          />
        </div>
        <div className="space-y-1">
          <div
            className="h-1 w-8 rounded-full opacity-60"
            style={{
              backgroundColor: colors.foreground,
            }}
          />
          <div
            className="h-1 w-10 rounded-full opacity-60"
            style={{
              backgroundColor: colors.foreground,
            }}
          />
        </div>
      </div>
      <div
        className="h-2 w-full rounded-full opacity-30"
        style={{
          backgroundColor: colors.foreground,
        }}
      />
    </div>
  )
}

const ColorPalettePreview: FC<{ colors: ThemeColors }> = ({ colors }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex flex-row gap-2">
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colors.avatar }}
        />
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colors.avatarWearable }}
        />
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colors.worldObject }}
        />
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colors.otherAsset }}
        />
      </div>
      <div className="flex flex-row gap-1">
        <Skeleton
          className="size-3 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
        <Skeleton
          className="size-3 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
        <Skeleton
          className="size-3 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    </div>
  )
}

const CardPreview: FC<{ colors: ThemeColors; typeColor: string }> = ({
  colors,
  typeColor,
}) => {
  return (
    <div
      className="w-14 rounded shadow-sm border p-1.5 space-y-1"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <AspectRatio ratio={1}>
        <div
          className="w-full h-full rounded-sm"
          style={{ backgroundColor: colors.secondary }}
        />
      </AspectRatio>
      <div
        className="h-1 w-5 rounded-sm"
        style={{ backgroundColor: typeColor }}
      />
      <div className="flex flex-row gap-1">
        <div
          className="h-2 rounded-xs flex-1"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="size-2 rounded-xs"
          style={{ backgroundColor: colors.secondary }}
        />
      </div>
    </div>
  )
}
