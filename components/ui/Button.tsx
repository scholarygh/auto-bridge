'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
      case 'outline':
        return 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      case 'xl':
        return 'px-8 py-4 text-xl'
      default:
        return 'px-4 py-2.5 text-base'
    }
  }

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </button>
  )
}

export default Button 