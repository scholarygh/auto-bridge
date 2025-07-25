'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'filled'
  label?: string
  required?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default',
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm'
      case 'lg': return 'px-4 py-3 text-lg'
      default: return 'px-4 py-2.5 text-base'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline': return 'border border-gray-300 bg-white hover:border-gray-400'
      case 'filled': return 'border border-gray-200 bg-gray-50 hover:bg-gray-100'
      default: return 'border border-gray-300 bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    }
  }

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange(option.value)
      setIsOpen(false)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between rounded-lg transition-all duration-200
            ${getSizeClasses()}
            ${getVariantClasses()}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        >
          <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={`
                  w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                `}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dropdown 