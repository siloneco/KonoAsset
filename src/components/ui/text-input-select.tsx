'use client'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { X } from 'lucide-react'
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
  label: string
  disable?: boolean
  priority?: number
  fixed?: boolean
  [key: string]: string | number | boolean | undefined
}

interface SingleSelectorProps {
  value?: Option | null
  defaultOptions?: Option[]
  options?: Option[]
  placeholder?: string
  loadingIndicator?: React.ReactNode
  emptyIndicator?: React.ReactNode
  delay?: number
  triggerSearchOnFocus?: boolean
  onSearch?: (value: string) => Promise<Option[]>
  onSearchSync?: (value: string) => Option[]
  onChange?: (option: Option | null) => void
  disabled?: boolean
  groupBy?: string
  className?: string
  selectFirstItem?: boolean
  creatable?: boolean
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
}

export interface SingleSelectorRef {
  selectedValue: Option | null
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
  const groupOption: { [key: string]: Option[] } = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

function isOptionsExist(
  groupOption: { [key: string]: Option[] },
  targetOption: Option,
) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.value === option.value)) {
      return true
    }
  }
  return false
}

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

const TextInputSelect = (
  {
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
    disabled,
    groupBy,
    className,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps
  }: SingleSelectorProps & {
    ref: React.RefObject<SingleSelectorRef>;
  }
) => {
  const { t } = useLocalization()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [onScrollbar, setOnScrollbar] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const [selected, setSelected] = React.useState<Option | null>(value || null)
  const [options, setOptions] = React.useState<{ [key: string]: Option[] }>(
    transToGroupOption(arrayDefaultOptions, groupBy),
  )
  const [inputValue, setInputValue] = React.useState('')
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

  const inputDivRef = React.useRef<HTMLDivElement>(null)
  const [commandListMaxHeight, setCommandListMaxHeight] =
    React.useState<number>(300)
  const [dropdownPosition, setDropdownPosition] = React.useState<
    'top' | 'bottom'
  >('bottom')
  const { getElementProperty } = useGetElementProperty(inputDivRef)

  // suggestの向きと高さを適切に設定する
  const updateCommandListDirectionAndMaxHeight = () => {
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
  }

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
      selectedValue: selected,
      input: inputRef.current as HTMLInputElement,
      focus: () => inputRef?.current?.focus(),
      reset: () => setSelected(null),
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

  const handleUnselect = React.useCallback(() => {
    setSelected(null)
    onChange?.(null)
  }, [onChange])

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
      isOptionsExist(options, { value: inputValue, label: inputValue }) ||
      (selected && selected.value === inputValue)
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
          setInputValue('')
          const newOption = { value, label: value }
          setSelected(newOption)
          onChange?.(newOption)
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

  const selectables = React.useMemo<{ [key: string]: Option[] }>(() => {
    const cloneOption = JSON.parse(JSON.stringify(options)) as {
      [key: string]: Option[]
    }
    for (const [key, value] of Object.entries(cloneOption)) {
      cloneOption[key] = value.filter(
        (val) => !selected || val.value !== selected.value,
      )
    }
    return cloneOption
  }, [options, selected])

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
    <div className="relative">
      <Command
        ref={dropdownRef}
        {...commandProps}
        className={cn(
          'h-auto overflow-visible bg-transparent',
          commandProps?.className,
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        }
        filter={commandFilter()}
      >
        <div
          className={cn(
            'min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            {
              'px-3 py-2': selected !== null,
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
          <div className="relative flex flex-wrap gap-1">
            {selected && (
              <div className="flex items-center justify-between overflow-hidden w-full">
                <span className="truncate">{selected.label}</span>
                <button
                  className={cn(
                    'ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    disabled && 'hidden',
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect()}
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            )}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              // Add keydown event listener to handle backspace
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !inputValue && selected) {
                  handleUnselect()
                }
              }}
              onValueChange={(value) => {
                setInputValue(value)
                // Invoking sync or async search if available
                if (!onSearch && onSearchSync) {
                  const res = onSearchSync(value)
                  setOptions(transToGroupOption(res || [], groupBy))
                }
                inputProps?.onValueChange?.(value)
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false)
                }
                inputProps?.onBlur?.(event)

                if (inputValue.length > 0) {
                  const newOption = { value: inputValue, label: inputValue }
                  setSelected(newOption)
                  setInputValue('')
                  onChange?.(newOption)
                }
              }}
              onFocus={(event) => {
                setOpen(true)
                updateCommandListDirectionAndMaxHeight() // 位置を再計算
                if (triggerSearchOnFocus && onSearch) {
                  onSearch(debouncedSearchTerm).then((res) =>
                    setOptions(transToGroupOption(res || [], groupBy)),
                  )
                }
                inputProps?.onFocus?.(event)
              }}
              placeholder={selected ? '' : placeholder}
              className={cn(
                'flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground',
                {
                  hidden: selected !== null && inputValue === '',
                  'w-full': selected === null || inputValue !== '',
                  'px-3 py-2': selected === null || inputValue !== '',
                },
                inputProps?.className,
              )}
            />
          </div>
        </div>
        {open && (
          <CommandList
            className={cn(
              'absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in',
              dropdownPosition === 'top'
                ? 'bottom-full mb-1' // 上に表示する場合
                : 'top-full mt-1', // 下に表示する場合
            )}
            style={{
              maxHeight: `${commandListMaxHeight}px`,
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
                              setInputValue('')
                              setSelected(option)
                              onChange?.(option)
                              setOpen(false) // Close the dropdown after an item is selected
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
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  )
}

TextInputSelect.displayName = 'TextInputSelect'
export default TextInputSelect
