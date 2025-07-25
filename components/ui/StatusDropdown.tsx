'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Wrench, Clock } from 'lucide-react'

interface StatusOption {
  value: string
  label: string
  description: string
  color: string
  icon?: React.ReactNode
}

interface StatusDropdownProps {
  options: StatusOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  required?: boolean
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select status',
  disabled = false,
  className = '',
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

  const handleSelect = (option: StatusOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  const getStatusIcon = (option: StatusOption) => {
    if (option.icon) return option.icon
    
    switch (option.value) {
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-gray-500" />
      case 'sourcing':
        return <Clock className="w-4 h-4 text-gray-500" />
      default:
        return <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
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
            px-4 py-2.5 text-base border border-gray-300 bg-white hover:border-gray-400
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {selectedOption && getStatusIcon(selectedOption)}
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
          <div className="absolute z-50 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700/50 transition-colors
                  cursor-pointer text-white
                  ${option.value === value ? 'bg-gray-700/50' : ''}
                `}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(option)}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-gray-400 text-sm">- {option.description}</span>
                </div>
                {option.value === value && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusDropdown 