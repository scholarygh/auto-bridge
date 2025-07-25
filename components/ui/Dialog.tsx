'use client'

import React from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Loader2,
  AlertCircle
} from 'lucide-react'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirmation'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  showCloseButton?: boolean
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  showCloseButton = true
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />
      case 'confirmation':
        return <AlertCircle className="w-12 h-12 text-blue-500" />
      default:
        return <Info className="w-12 h-12 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'confirmation':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      case 'confirmation':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all ${getBackgroundColor()} border`}>
          
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Content */}
          <div className="px-6 py-8">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>

            {/* Title */}
            <h3 className="text-center text-xl font-semibold text-gray-900 mb-3">
              {title}
            </h3>

            {/* Message */}
            <p className="text-center text-gray-600 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {onCancel && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
              )}
              
              {onConfirm && (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${getButtonColor()}`}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmText}
                </button>
              )}
              
              {!onConfirm && !onCancel && (
                <button
                  onClick={onClose}
                  className={`w-full px-4 py-3 text-white rounded-xl font-medium transition-colors ${getButtonColor()}`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog 