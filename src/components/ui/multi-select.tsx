'use client'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { X } from 'lucide-react'
import * as React from 'react'
import { forwardRef, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { useLocalization } from '@/hooks/use-localization'
import { ScrollArea } from './scroll-area'

export interface Option {
  value: string
  label: string
  disable?: boolean
  priority?: number
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | number | boolean | undefined
}
interface GroupOption {
  [key: string]: Option[]
}

interface MultipleSelectorProps {
  value?: Option[]
  defaultOptions?: Option[]
  /** manually controlled options */
  options?: Option[]
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[]
  onChange?: (options: Option[]) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  /** Group the options base on provided key. */
  groupBy?: string
  className?: string
  badgeClassName?: string
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
  /** hide the clear all button. */
  hideClearAllButton?: boolean
}

export interface MultipleSelectorRef {
  selectedValue: Option[]
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

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value),
    )
  }
  return cloneOption
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true
    }
  }
  return false
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0)

  if (!render) return null

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

const MultipleSelector = ({
  ref,
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
}: MultipleSelectorProps & {
  ref?: React.RefObject<MultipleSelectorRef>
}) => {
  const { t } = useLocalization()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [onScrollbar, setOnScrollbar] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = React.useState<
    'top' | 'bottom'
  >('bottom')

  const [selected, setSelected] = React.useState<Option[]>(value || [])
  const [options, setOptions] = React.useState<GroupOption>(
    transToGroupOption(arrayDefaultOptions, groupBy),
  )
  const [inputValue, setInputValue] = React.useState('')
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

  const inputDivRef = React.useRef<HTMLDivElement>(null)
  const badgesContainerRef = React.useRef<HTMLDivElement>(null)
  const [commandListMaxHeight, setCommandListMaxHeight] =
    React.useState<number>(300)
  const [inputHeight, setInputHeight] = React.useState<number>(0)
  const [lastBadgeInFirstRow, setLastBadgeInFirstRow] = React.useState<
    number | null
  >(null)
  const { getElementProperty } = useGetElementProperty(inputDivRef)

  // suggestの向きと高さを適切に設定する
  const updateCommandListDirectionAndMaxHeight = () => {
    const windowHeight = window.innerHeight
    const inputDivTop = getElementProperty('top')
    const inputDivBottom = getElementProperty('bottom')
    const currentInputHeight = getElementProperty('height')

    // 入力欄の高さを保存
    setInputHeight(currentInputHeight)

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
  }

  // Check badge positions to find the last badge in the first row
  React.useLayoutEffect(() => {
    if (selected.length <= 1) {
      setLastBadgeInFirstRow(null)
      return
    }

    const animationFrameId = requestAnimationFrame(() => {
      if (!badgesContainerRef.current) return

      // Get all badge elements
      const badges = Array.from(
        badgesContainerRef.current.querySelectorAll('[data-badge]'),
      ) as HTMLElement[]

      if (badges.length === 0) return

      // Get the top position of the first badge
      const firstRowTop = badges[0].getBoundingClientRect().top
      let lastIndex = 0

      // Find the last badge in the first row
      for (let i = 1; i < badges.length; i++) {
        const top = badges[i].getBoundingClientRect().top
        if (top > firstRowTop + 5) {
          // 5px threshold for detecting new row
          break
        }
        lastIndex = i
      }

      setLastBadgeInFirstRow(lastIndex)
    })

    return () => cancelAnimationFrame(animationFrameId)
  }, [selected])

  useEffect(() => {
    updateCommandListDirectionAndMaxHeight()
  }, [selected])

  useEffect(() => {
    window.addEventListener('resize', updateCommandListDirectionAndMaxHeight)
    return () =>
      window.removeEventListener(
        'resize',
        updateCommandListDirectionAndMaxHeight,
      )
  }, [])

  React.useImperativeHandle(
    ref,
    () => ({
      selectedValue: [...selected],
      input: inputRef.current as HTMLInputElement,
      focus: () => inputRef?.current?.focus(),
      reset: () => setSelected([]),
    }),
    [selected],
  )

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
      inputRef.current.blur()
    }
  }

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newOptions = selected.filter((s) => s.value !== option.value)
      setSelected(newOptions)
      onChange?.(newOptions)
    },
    [onChange, selected],
  )

  // State to track if backspace/delete is being debounced
  const [isBackspaceDebounced, setIsBackspaceDebounced] = React.useState(false)

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value !== '') {
            setIsBackspaceDebounced(true)
          } else if (selected.length > 0 && !isBackspaceDebounced) {
            const lastSelectOption = selected[selected.length - 1]
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1])

              setIsBackspaceDebounced(true)
              setTimeout(() => {
                setIsBackspaceDebounced(false)
              }, 300)
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [handleUnselect, selected, isBackspaceDebounced],
  )

  // Handle key up to reset the debounce flag when the key is released
  const handleKeyUp = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Reset the debounce flag when the key is released
        setIsBackspaceDebounced(false)
      }
    },
    [],
  )

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

  useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy)
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption)
    }
  }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

  useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm)
      setOptions(transToGroupOption(res || [], groupBy))
    }

    const exec = async () => {
      if (!onSearchSync || !open) return

      if (triggerSearchOnFocus) {
        doSearchSync()
      }

      if (debouncedSearchTerm) {
        doSearchSync()
      }
    }

    void exec()
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  useEffect(() => {
    /** async search */

    const doSearch = async () => {
      setIsLoading(true)
      const res = await onSearch?.(debouncedSearchTerm)
      setOptions(transToGroupOption(res || [], groupBy))
      setIsLoading(false)
    }

    const exec = async () => {
      if (!onSearch || !open) return

      if (triggerSearchOnFocus) {
        await doSearch()
      }

      if (debouncedSearchTerm) {
        await doSearch()
      }
    }

    void exec()
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  const CreatableItem = () => {
    if (!creatable) return undefined
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find((s) => s.value === inputValue)
    ) {
      return undefined
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length)
            return
          }
          setInputValue('')
          const newOptions = [...selected, { value, label: value }]
          setSelected(newOptions)
          onChange?.(newOptions)
        }}
      >
        {`${t('ui:multi-select:create-new')}: "${inputValue}"`}
      </CommandItem>
    )

    // For normal creatable
    if (!onSearch && inputValue.length > 0) {
      return Item
    }

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return Item
    }

    return undefined
  }

  const EmptyItem = React.useCallback(() => {
    if (!emptyIndicator) return undefined

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      )
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>
  }, [creatable, emptyIndicator, onSearch, options])

  const selectables = React.useMemo<GroupOption>(
    () => removePickedOption(options, selected),
    [options, selected],
  )

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = React.useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter
    }

    if (creatable) {
      return (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
      }
    }
    // Using default filter in `cmdk`. We don't have to provide it.
    return undefined
  }, [creatable, commandProps?.filter])

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={(e) => {
        handleKeyDown(e)
        commandProps?.onKeyDown?.(e)
      }}
      onKeyUp={(e) => {
        handleKeyUp(e)
        commandProps?.onKeyUp?.(e)
      }}
      className={cn(
        'h-auto overflow-visible bg-transparent',
        commandProps?.className,
      )}
      shouldFilter={
        commandProps?.shouldFilter !== undefined
          ? commandProps.shouldFilter
          : !onSearch
      } // When onSearch is provided, we don't want to filter the options. You can still override it.
      filter={commandFilter()}
    >
      <div
        className={cn(
          'min-h-10 rounded-md dark:bg-input/30 border border-input text-sm ring-offset-background',
          'transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          {
            'pl-3': selected.length !== 0,
            'cursor-text': !disabled && selected.length !== 0,
          },
          className,
        )}
        ref={inputDivRef}
        onClick={() => {
          if (disabled) return
          inputRef?.current?.focus()
        }}
      >
        <div className="relative flex flex-wrap gap-1">
          <ScrollArea className="max-h-36">
            <div
              className="flex flex-wrap gap-1 py-2 pr-2"
              ref={badgesContainerRef}
            >
              {selected.map((option, index) => {
                return (
                  <Badge
                    key={option.value}
                    className={cn(
                      'cursor-default flex shrink',
                      'data-disabled:bg-muted-foreground data-disabled:text-muted data-disabled:hover:bg-muted-foreground overflow-hidden',
                      'data-fixed:bg-muted-foreground data-fixed:text-muted data-fixed:hover:bg-muted-foreground overflow-hidden',
                      // Xボタンと重ならないようにする
                      {
                        'mr-6': lastBadgeInFirstRow === index,
                      },
                      badgeClassName,
                    )}
                    data-badge={true}
                    data-fixed={option.fixed}
                    data-disabled={disabled || undefined}
                  >
                    <span className="truncate">{option.label}</span>
                    <button
                      className={cn(
                        'ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        (disabled || option.fixed) && 'hidden',
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(option)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleUnselect(option)}
                    >
                      <X className="h-4 w-4 text-foreground cursor-pointer" />
                    </button>
                  </Badge>
                )
              })}
              {/* Avoid having the "Search" Icon */}
              <CommandPrimitive.Input
                {...inputProps}
                ref={inputRef}
                value={inputValue}
                disabled={disabled}
                onValueChange={(value) => {
                  setInputValue(value)
                  inputProps?.onValueChange?.(value)
                }}
                onBlur={(event) => {
                  if (!onScrollbar) {
                    setOpen(false)
                  }
                  inputProps?.onBlur?.(event)

                  if (inputValue.length > 0) {
                    const newOptions = [
                      ...selected,
                      { value: inputValue, label: inputValue },
                    ]
                    setSelected(newOptions)
                    onChange?.(newOptions)
                    setInputValue('')
                  }
                }}
                onFocus={(event) => {
                  setOpen(true)
                  updateCommandListDirectionAndMaxHeight() // 位置を再計算
                  if (triggerSearchOnFocus) {
                    onSearch?.(debouncedSearchTerm)
                  }
                  inputProps?.onFocus?.(event)
                }}
                placeholder={
                  hidePlaceholderWhenSelected && selected.length !== 0
                    ? ''
                    : placeholder
                }
                className={cn(
                  'flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground',
                  {
                    'w-fit':
                      hidePlaceholderWhenSelected &&
                      document.activeElement === inputRef.current,
                    'w-full':
                      hidePlaceholderWhenSelected &&
                      document.activeElement !== inputRef.current,
                    'px-3': selected.length === 0,
                    'ml-1': selected.length !== 0,
                  },
                  inputProps?.className,
                )}
              />
            </div>
          </ScrollArea>
          <button
            type="button"
            onClick={() => {
              setSelected(selected.filter((s) => s.fixed))
              onChange?.(selected.filter((s) => s.fixed))
            }}
            className={cn(
              'absolute top-2 right-2 h-6 w-6 p-0',
              (hideClearAllButton ||
                disabled ||
                selected.length < 1 ||
                selected.filter((s) => s.fixed).length === selected.length) &&
                'hidden',
            )}
          >
            <X className="cursor-pointer text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
      <div className="relative">
        {open && (
          <CommandList
            className={cn(
              'absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden',
              dropdownPosition === 'top'
                ? 'bottom-full -left-1' // 上に表示する場合
                : 'top-full mt-1', // 下に表示する場合
            )}
            style={{
              maxHeight: `${commandListMaxHeight}px`,
              ...(dropdownPosition === 'top'
                ? { marginBottom: `${inputHeight + 4}px` }
                : {}),
            }}
            onMouseLeave={() => {
              setOnScrollbar(false)
            }}
            onMouseEnter={() => {
              setOnScrollbar(true)
            }}
            onMouseUp={() => {
              inputRef?.current?.focus()
            }}
          >
            {isLoading ? (
              <>{loadingIndicator}</>
            ) : (
              <>
                {EmptyItem()}
                {CreatableItem()}
                {!selectFirstItem && (
                  <CommandItem value="-" className="hidden" />
                )}
                {Object.entries(selectables).map(([key, dropdowns]) => (
                  <CommandGroup
                    key={key}
                    heading={key}
                    className="h-full overflow-auto"
                  >
                    <>
                      {dropdowns
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

                          return a.label.localeCompare(b.label, 'ja')
                        })
                        .map((option) => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onSelect={() => {
                                if (selected.length >= maxSelected) {
                                  onMaxSelected?.(selected.length)
                                  return
                                }
                                setInputValue('')
                                const newOptions = [...selected, option]
                                setSelected(newOptions)
                                onChange?.(newOptions)
                              }}
                              className={cn(
                                'cursor-pointer',
                                option.disable &&
                                  'cursor-default text-muted-foreground',
                              )}
                            >
                              {option.label}
                            </CommandItem>
                          )
                        })}
                    </>
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  )
}

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
