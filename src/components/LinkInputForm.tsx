'use client'

import { useState } from 'react'

interface LinkInputFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export function LinkInputForm({ onSubmit, isLoading }: LinkInputFormProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="粘贴抖音分享链接，如 https://v.douyin.com/xxx"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all outline-none text-white placeholder-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700
                     rounded-lg font-semibold transition-all transform active:scale-95
                     flex items-center justify-center gap-2
                     disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>解析中...</span>
            </>
          ) : (
            <span>解析</span>
          )}
        </button>
      </div>
    </form>
  )
}
