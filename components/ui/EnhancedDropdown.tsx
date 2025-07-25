'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface EnhancedOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface EnhancedDropdownProps {
  options: EnhancedOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dark' | 'light'
  label?: string
  required?: boolean
}

const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
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
      case 'dark': return 'border border-gray-600 bg-gray-800 text-white hover:border-gray-500'
      case 'light': return 'border border-gray-200 bg-gray-50 hover:bg-gray-100'
      default: return 'border border-gray-300 bg-white hover:border-gray-400'
    }
  }

  const getDropdownVariantClasses = () => {
    switch (variant) {
      case 'dark': return 'bg-gray-800/95 backdrop-blur-sm border border-gray-700 text-white'
      case 'light': return 'bg-white border border-gray-200 text-gray-900'
      default: return 'bg-white border border-gray-200 text-gray-900'
    }
  }

  const handleSelect = (option: EnhancedOption) => {
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
          <div className="flex items-center gap-2">
            {selectedOption?.icon && selectedOption.icon}
            <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-xl max-h-60 overflow-auto ${getDropdownVariantClasses()}`}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${variant === 'dark' 
                    ? `${option.value === value ? 'bg-gray-700/50' : 'hover:bg-gray-700/50'} text-white`
                    : `${option.value === value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'} text-gray-900`
                  }
                `}
              >
                <div className="flex items-center gap-2 flex-1">
                  {option.icon && option.icon}
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className={`text-sm ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
                {option.value === value && (
                  <Check className={`w-4 h-4 ${variant === 'dark' ? 'text-white' : 'text-blue-600'}`} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedDropdown 