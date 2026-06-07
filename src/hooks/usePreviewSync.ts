import { useEffect, useRef, useCallback } from 'react'

type PreviewSyncOptions = {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  invitationId?: string
}

export function usePreviewSync({ iframeRef, invitationId }: PreviewSyncOptions) {
  const isIframeReady = useRef(false)

  // In a full implementation, the iframe would send a 'READY' message back
  // For now, we just assume it's ready after a short delay or when loaded
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TEMPLATE_READY') {
        isIframeReady.current = true
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const syncPages = useCallback((pages: any[]) => {
    if (!iframeRef.current?.contentWindow) return

    try {
      // Attempt to send postMessage to iframe
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'SYNC_PAGES',
          payload: pages
        },
        '*' // In production, this should be restricted to the specific domain
      )

      // Fallback: If we know the template doesn't support postMessage yet,
      // we could trigger a reload. For hybrid approach, we will reload if
      // the iframe hasn't sent a READY message, or just reload as a brute-force fallback.
      // 
      // To prevent infinite reloading loops on every keystroke, we might want to debounce this 
      // if using the fallback.
      // 
      // if (!isIframeReady.current) {
      //   iframeRef.current.src = iframeRef.current.src
      // }
    } catch (err) {
      console.warn('Failed to sync via postMessage, falling back to reload', err)
      // Fallback
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src
        iframeRef.current.src = currentSrc
      }
    }
  }, [iframeRef])

  const syncGlobalSettings = useCallback((settings: any) => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'SYNC_GLOBAL_SETTINGS',
        payload: settings
      },
      '*'
    )
  }, [iframeRef])

  const triggerReload = useCallback(() => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src
      // Add a cache-busting timestamp to force a reload if needed
      const url = new URL(currentSrc)
      url.searchParams.set('_t', Date.now().toString())
      iframeRef.current.src = url.toString()
    }
  }, [iframeRef])

  return {
    syncPages,
    syncGlobalSettings,
    triggerReload
  }
}
