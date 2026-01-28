'use client'

import { useReducer } from 'react'
import { LinkInputForm, ErrorAlert, ResultDisplay } from '@/components'
import { AppState, ParsedData } from '@/lib/types'

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ParsedData }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' }

const initialState: AppState = {
  status: 'idle',
  data: null,
  error: null,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading', data: null, error: null }
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null }
    case 'FETCH_ERROR':
      return { status: 'error', data: null, error: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleParse = async (url: string) => {
    dispatch({ type: 'FETCH_START' })

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || '解析失败')
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
    } catch (error) {
      const message = error instanceof Error ? error.message : '解析失败，请稍后重试'
      dispatch({ type: 'FETCH_ERROR', payload: message })
    }
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto max-w-2xl p-4 flex flex-col gap-6">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold text-white mb-2">抖音视频解析器</h1>
          <p className="text-gray-400">
            粘贴抖音分享链接，解析视频/图集信息并下载
          </p>
        </header>

        {/* Input Form */}
        <LinkInputForm
          onSubmit={handleParse}
          isLoading={state.status === 'loading'}
        />

        {/* Loading */}
        {state.status === 'loading' && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        )}

        {/* Error */}
        {state.status === 'error' && state.error && (
          <ErrorAlert
            message={state.error}
            onDismiss={() => dispatch({ type: 'RESET' })}
          />
        )}

        {/* Result */}
        {state.status === 'success' && state.data && (
          <ResultDisplay data={state.data} />
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-4 mt-auto">
          <p>仅供学习交流使用，请遵守相关法律法规</p>
          <p className="mt-1">
            基于{' '}
            <a
              href="https://github.com/Everless321/dYm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              dy-downloader
            </a>{' '}
            构建
          </p>
        </footer>
      </div>
    </main>
  )
}
