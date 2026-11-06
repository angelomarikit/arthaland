/// <reference types="vite/client" />

declare global {
  interface Window {
    fbq?: (
      action: string,
      event?: string,
      params?: Record<string, unknown>,
    ) => void
  }
}

export {}
