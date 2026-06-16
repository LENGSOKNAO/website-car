import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface ComboboxOption {
  value: string; label: string
}

interface ComboboxProps {
  label?: string; error?: string; hint?: string;
  value: string; onChange: (value: string) => void;
  options: ComboboxOption[]; placeholder?: string; disabled?: boolean;
}

export default function Combobox({
  label, error, hint, value, onChange, options, placeholder, disabled
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) setFocusedIdx(-1)
  }, [isOpen])

  useEffect(() => {
    const match = options.find((o) => o.value === value)
    if (match) {
      setInputValue(match.label)
    } else if (!value) {
      setInputValue("")
    }
  }, [value, options])

  const selectOption = (opt: ComboboxOption) => {
    onChange(opt.value)
    setInputValue(opt.label)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (text: string) => {
    setInputValue(text)
    if (!isOpen) setIsOpen(true)
    if (text === "") onChange("")
    setFocusedIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }
    if (e.key === "ArrowDown") {
      setFocusedIdx((prev) => Math.min(prev + 1, filteredOptions.length - 1))
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      setFocusedIdx((prev) => Math.max(prev - 1, 0))
      e.preventDefault()
    } else if (e.key === "Enter" && focusedIdx >= 0) {
      selectOption(filteredOptions[focusedIdx])
      e.preventDefault()
    } else if (e.key === "Escape") {
      setIsOpen(false)
      e.preventDefault()
    }
  }

  const id = label ? `combobox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined

  return (
    <div className="space-y-1.5" ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "block w-full rounded-sm border bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-500",
            "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
            error ? "border-red-500/50" : "border-gray-300 hover:border-gray-400",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-sm border border-gray-200 bg-white shadow-lg max-h-48 overflow-auto">
            {filteredOptions.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onMouseDown={() => selectOption(opt)}
                onMouseEnter={() => setFocusedIdx(i)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm transition-colors",
                  focusedIdx === i ? "bg-gray-100 text-gray-900" : "text-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
