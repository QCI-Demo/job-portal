import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastVariant = 'success' | 'error'

interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextId = useRef(0)

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = nextId.current++
    setToasts((current) => [...current, { id, message, variant }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage
  onDismiss: (id: number) => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  const isSuccess = toast.variant === 'success'

  return (
    <div
      role="status"
      className={[
        'pointer-events-auto rounded-md px-4 py-3 text-sm font-medium shadow-lg',
        isSuccess ? 'bg-green-800 text-white' : 'bg-red-800 text-white',
      ].join(' ')}
    >
      {toast.message}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
