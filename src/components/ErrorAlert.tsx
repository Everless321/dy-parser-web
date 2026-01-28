'use client'

interface ErrorAlertProps {
  message: string
  onDismiss: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg
                    flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p>{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-xl hover:text-white transition-colors p-1"
      >
        &times;
      </button>
    </div>
  )
}
