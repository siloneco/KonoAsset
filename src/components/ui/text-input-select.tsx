'use client'

import { Command as CommandPrimitive } from 'cmdk'
import * as React from 'react'
import { forwardRef, useEffect } from 'react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { useLocalization } from '@/hooks/use-localization'

export interface Option {
  value: string
  disable?: boolean
  priority?: number
}

interface TextInputSelectProps {
  value?: string
  options?: Option[]
  placeholder?: string
  loadingIndicator?: React.ReactNode
  emptyIndicator?: React.ReactNode
  delay?: number
  triggerSearchOnFocus?: boolean
  onSearch?: (value: string) => Promise<Option[]>
  onSearchSync?: (value: string) => Option[]
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
}

export interface TextInputSelectRef {
  selectedValue: string
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  return debouncedValue
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  )
})
CommandEmpty.displayName = 'CommandEmpty'

const TextInputSelect = forwardRef<TextInputSelectRef, TextInputSelectProps>(
  (
    {
      value,
      onChange,
      placeholder,
      options = [],
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      disabled,
      className,
      triggerSearchOnFocus = false,
      inputProps,
    },
    ref,
  ) => {
    const { t } = useLocalization()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const [inputValue, setInputValue] = React.useState(value || '')
    const [suggestions, setSuggestions] = React.useState<Option[]>(options)
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

    const inputDivRef = React.useRef<HTMLDivElement>(null)
    const [commandListMaxHeight, setCommandListMaxHeight] =
      React.useState<number>(300)
    const [dropdownPosition, setDropdownPosition] = React.useState<
      'top' | 'bottom'
    >('bottom')
    const { getElementProperty } = useGetElementProperty(inputDivRef)

    // サジェストの向きと高さを適切に設定する
    const updateCommandListDirectionAndMaxHeight = React.useCallback(() => {
      const windowHeight = window.innerHeight
      const inputDivTop = getElementProperty('top')
      const inputDivBottom = getElementProperty('bottom')

      // 下方向に300px以上のスペースがある場合は常に下に表示
      // それ以外の場合は、スペースが大きい向きに表示
      const spaceBelow = windowHeight - inputDivBottom
      const shouldShowAbove =
        spaceBelow < 300 && inputDivBottom > windowHeight / 2

      setDropdownPosition(shouldShowAbove ? 'top' : 'bottom')

      // 上に表示する場合と下に表示する場合で高さを計算
      const commandListHeight = shouldShowAbove
        ? Math.min(Math.max(inputDivTop - 20, 75), 300) // 上に表示する場合
        : Math.min(Math.max(windowHeight - inputDivBottom - 20, 75), 300) // 下に表示する場合

      setCommandListMaxHeight(commandListHeight)
    }, [getElementProperty])

    useEffect(() => {
      updateCommandListDirectionAndMaxHeight()
    }, [inputValue, updateCommandListDirectionAndMaxHeight])

    useEffect(() => {
      window.addEventListener('resize', updateCommandListDirectionAndMaxHeight)
      return () => {
        window.removeEventListener(
          'resize',
          updateCommandListDirectionAndMaxHeight,
        )
      }
    }, [updateCommandListDirectionAndMaxHeight])

    // 初期オプションの設定
    useEffect(() => {
      if (options.length > 0) {
        setSuggestions(options)
      }
    }, [options])

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: inputValue,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setInputValue(''),
      }),
      [inputValue],
    )

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const commandList = dropdownRef.current?.querySelector('[cmdk-list]')

      // Don't close if clicking inside the command list (including scrollbar)
      if (commandList?.contains(target)) {
        return
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setOpen(false)
        inputRef.current.blur()
      }
    }

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open])

    // 値の同期
    useEffect(() => {
      if (value !== undefined) {
        setInputValue(value)
      }
    }, [value])

    // 同期検索の処理
    useEffect(() => {
      if (!onSearchSync || !open) return

      const doSearchSync = () => {
        const res = onSearchSync(debouncedSearchTerm)
        setSuggestions(res || [])
      }

      if (triggerSearchOnFocus) {
        doSearchSync()
      }

      if (debouncedSearchTerm) {
        doSearchSync()
      }
    }, [debouncedSearchTerm, open, triggerSearchOnFocus, onSearchSync])

    // 非同期検索の処理
    useEffect(() => {
      if (!onSearch || !open) return

      const doSearch = async () => {
        setIsLoading(true)
        try {
          const res = await onSearch(debouncedSearchTerm)
          setSuggestions(res || [])
        } finally {
          setIsLoading(false)
        }
      }

      if (triggerSearchOnFocus) {
        void doSearch()
      }

      if (debouncedSearchTerm) {
        void doSearch()
      }
    }, [debouncedSearchTerm, open, triggerSearchOnFocus, onSearch])

    const handleInputChange = React.useCallback(
      (value: string) => {
        setInputValue(value)
        if (!onSearch && onSearchSync) {
          const res = onSearchSync(value)
          setSuggestions(res || [])
        }
        onChange?.(value)
        inputProps?.onValueChange?.(value)
      },
      [onSearch, onSearchSync, inputProps, onChange],
    )

    const handleSelect = React.useCallback(
      (option: Option) => {
        const newValue = option.value.trim()
        setInputValue(newValue)
        // Ensure the input value is updated before calling onChange
        requestAnimationFrame(() => {
          onChange?.(newValue)
          setOpen(false)
          inputRef.current?.blur()
        })
      },
      [onChange],
    )

    const CreatableItem = () => {
      const trimmedInput = inputValue.trim()

      if (!trimmedInput) return undefined

      // Check if there's an exact match in suggestions (comparing trimmed values)
      const exactMatch = suggestions.some((s) => s.value === inputValue)

      if (exactMatch) return undefined

      return (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onSelect={() => {
            setInputValue(trimmedInput) // Use trimmed value for display
            onChange?.(trimmedInput)
            setOpen(false)
            inputRef.current?.blur()
          }}
        >
          {`${t('ui:multi-select:create-new')}: "${trimmedInput}"`}
        </CommandItem>
      )
    }

    return (
      <div className="relative">
        <Command
          ref={dropdownRef}
          className={cn('h-auto overflow-visible bg-transparent')}
          shouldFilter={!onSearch && !onSearchSync}
        >
          <div
            className={cn(
              'min-h-10 rounded-md dark:bg-input/30 border border-input text-sm ring-offset-background',
              'transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
              'px-3 py-2',
              {
                'cursor-text': !disabled,
              },
              className,
            )}
            ref={inputDivRef}
            onClick={() => {
              if (disabled) return
              inputRef?.current?.focus()
            }}
          >
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={handleInputChange}
              onBlur={(event) => {
                // Check if the related target is within the dropdown
                const relatedTarget = event.relatedTarget as Node
                const commandList =
                  dropdownRef.current?.querySelector('[cmdk-list]')
                if (commandList?.contains(relatedTarget)) {
                  return
                }

                setOpen(false)
                const trimmedInput = inputValue.trim()
                onChange?.(trimmedInput)
                inputProps?.onBlur?.(event)
              }}
              onFocus={(event) => {
                setOpen(true)
                updateCommandListDirectionAndMaxHeight()
                if (triggerSearchOnFocus && onSearch) {
                  onSearch(debouncedSearchTerm).then((res) =>
                    setSuggestions(res || []),
                  )
                }
                inputProps?.onFocus?.(event)
              }}
              placeholder={placeholder}
              className={cn(
                'flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground',
                'w-full',
                inputProps?.className,
              )}
            />
          </div>
          {open && (
            <CommandList
              className={cn(
                'absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden',
                'p-1',
                dropdownPosition === 'top'
                  ? 'bottom-full mb-1'
                  : 'top-full mt-1',
              )}
              style={{
                maxHeight: `${commandListMaxHeight}px`,
              }}
              onMouseDown={(e) => {
                // Prevent the input from losing focus when clicking the dropdown
                e.preventDefault()
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {suggestions.length === 0 && !inputValue.trim() && (
                    <CommandEmpty>{emptyIndicator}</CommandEmpty>
                  )}
                  <CreatableItem />
                  <CommandGroup heading="" className="p-0">
                    {suggestions
                      .sort((a, b) => {
                        if (
                          a.priority !== undefined &&
                          b.priority !== undefined
                        ) {
                          if (a.priority !== b.priority) {
                            return b.priority - a.priority
                          }
                        } else if (a.priority !== undefined) {
                          return 1
                        } else if (b.priority !== undefined) {
                          return -1
                        }

                        return a.value.localeCompare(b.value, 'ja')
                      })
                      .map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disable}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onSelect={() => handleSelect(option)}
                          className={cn(
                            'cursor-pointer px-2 py-1.5',
                            option.disable &&
                              'cursor-default text-muted-foreground',
                          )}
                        >
                          {option.value}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          )}
        </Command>
      </div>
    )
  },
)

TextInputSelect.displayName = 'TextInputSelect'
export default TextInputSelect
