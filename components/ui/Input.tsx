'use client'

import React, { forwardRef } from 'react'
import { Search, Eye, EyeOff } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'outline' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  showPasswordToggle?: boolean
  multiline?: boolean
  rows?: number
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  showPasswordToggle = false,
  multiline = false,
  rows = 3,
  className = '',
  type = 'text',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

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

  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type

  const inputClasses = `
    w-full rounded-lg transition-all duration-200 resize-none
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
    ${isFocused ? 'ring-2 ring-blue-500/20' : ''}
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true)
    onFocus?.(e as any)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false)
    onBlur?.(e as any)
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {multiline ? (
          <textarea
            rows={rows}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        )}
        
        {rightIcon && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input 