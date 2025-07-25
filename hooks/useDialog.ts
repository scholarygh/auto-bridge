'use client'

import { useState, useCallback } from 'react'

export interface DialogState {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  showCloseButton?: boolean
}

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showDialog = useCallback((config: Omit<DialogState, 'isOpen'>) => {
    setDialog({
      ...config,
      isOpen: true
    })
  }, [])

  const hideDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }))
  }, [])

  const showSuccess = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'success'
    })
  }, [showDialog])

  const showError = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'error'
    })
  }, [showDialog])

  const showWarning = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'warning'
    })
  }, [showDialog])

  const showInfo = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'info'
    })
  }, [showDialog])

  const showConfirmation = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirmation',
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    })
  }, [showDialog])

  const showLoading = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'info',
      loading: true,
      showCloseButton: false
    })
  }, [showDialog])

  return {
    dialog,
    showDialog,
    hideDialog,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    showLoading
  }
} 