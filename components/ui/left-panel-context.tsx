"use client"

import React from 'react'

type LeftPanelPayload = {
  name?: string
  title?: React.ReactNode
  html?: React.ReactNode
}

type LeftPanelContextValue = {
  open: boolean
  title?: React.ReactNode
  html?: React.ReactNode
  contentKey?: string
  openPanel: (p: LeftPanelPayload) => void
  closePanel: () => void
  togglePanel: (p: LeftPanelPayload) => void
}

const LeftPanelContext = React.createContext<LeftPanelContextValue | undefined>(undefined)

export function LeftPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState<React.ReactNode | undefined>(undefined)
  const [html, setHtml] = React.useState<React.ReactNode | undefined>(undefined)
  const [contentKey, setContentKey] = React.useState<string | undefined>(undefined)
  const fetchAbortRef = React.useRef<AbortController | null>(null)
  // timeout ref used to sequence close -> open when swapping content
  const pendingTimeoutRef = React.useRef<number | null>(null)
  const ANIM_MS = 500 // must match LeftPanel animation duration

  const openPanel = React.useCallback((p: LeftPanelPayload) => {
    // If panel is open and different content is requested, close first then open new content
    if (open && p.name && p.name !== contentKey) {
      // clear any pending open
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      // close current (triggers animation in LeftPanel)
      setOpen(false)
      try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:close')) } catch (e) {}
      // schedule opening new content after animation
      pendingTimeoutRef.current = window.setTimeout(() => {
        pendingTimeoutRef.current = null
        setContentKey(p.name)
        setTitle(p.title ?? p.name)
        setHtml(p.html)
        setOpen(true)
        try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:openDetail', { detail: { name: p.name } })) } catch (e) {}
        // fetch title if id-like
        try {
          const m = String(p.name ?? '').match(/#(\w+)$/)
          if (m && m[1]) {
            try { fetchAbortRef.current?.abort() } catch (e) {}
            const ac = new AbortController()
            fetchAbortRef.current = ac
            ;(async () => {
              try {
                const res = await fetch(`/api/infra/id?id=${encodeURIComponent(m[1])}`, { signal: ac.signal, credentials: 'same-origin' })
                if (!res.ok) return
                const j = await res.json().catch(() => null)
                if (j && j.name) setTitle(j.name)
              } catch (e) {}
            })()
          }
        } catch (e) {}
      }, ANIM_MS)
      return
    }

    // normal immediate open (panel closed or same content)
    setContentKey(p.name)
    setTitle(p.title ?? p.name)
    setHtml(p.html)
    setOpen(true)
    // notify listeners with panel payload (useful for map to recentre when infra opens)
    try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:openDetail', { detail: { name: p.name } })) } catch (e) {}
    // If the provided name contains an infra id like "#123" try to fetch the real name
    try {
      const m = String(p.name ?? '').match(/#(\w+)$/)
      if (m && m[1]) {
        // abort previous
        try { fetchAbortRef.current?.abort() } catch (e) {}
        const ac = new AbortController()
        fetchAbortRef.current = ac
        ;(async () => {
          try {
            const res = await fetch(`/api/infra/id?id=${encodeURIComponent(m[1])}`, { signal: ac.signal, credentials: 'same-origin' })
            if (!res.ok) return
            const j = await res.json().catch(() => null)
            if (j && j.name) setTitle(j.name)
          } catch (e) {
            // ignore fetch errors
          }
        })()
      }
    } catch (e) {}
  }, [open, contentKey])

  const closePanel = React.useCallback(() => {
    // cancel any pending open
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }
    setOpen(false)
    try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:close')) } catch (e) {}
  }, [])

  const togglePanel = React.useCallback((p: LeftPanelPayload) => {
    // if same contentKey and currently open -> close
    if (p.name && open && p.name === contentKey) {
      // cancel pending opens
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      setOpen(false)
      try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:close')) } catch (e) {}
      return
    }

    // If switching to a different content while panel is open -> close then open
    if (open && p.name && p.name !== contentKey) {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      setOpen(false)
      try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:close')) } catch (e) {}
      pendingTimeoutRef.current = window.setTimeout(() => {
        pendingTimeoutRef.current = null
        setContentKey(p.name)
        setTitle(p.title ?? p.name)
        setHtml(p.html)
        setOpen(true)
        try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:openDetail', { detail: { name: p.name } })) } catch (e) {}
        // fetch title if id-like
        try {
          const m = String(p.name ?? '').match(/#(\w+)$/)
          if (m && m[1]) {
            try { fetchAbortRef.current?.abort() } catch (e) {}
            const ac = new AbortController()
            fetchAbortRef.current = ac
            ;(async () => {
              try {
                const res = await fetch(`/api/infra/id?id=${encodeURIComponent(m[1])}`, { signal: ac.signal, credentials: 'same-origin' })
                if (!res.ok) return
                const j = await res.json().catch(() => null)
                if (j && j.name) setTitle(j.name)
              } catch (e) {}
            })()
          }
        } catch (e) {}
      }, ANIM_MS)
      return
    }

    // otherwise simply set content and open
    setContentKey(p.name)
    setTitle(p.title ?? p.name)
    setHtml(p.html)
    setOpen(true)
    try { window.dispatchEvent(new CustomEvent('infraster:leftPanel:openDetail', { detail: { name: p.name } })) } catch (e) {}
    try {
      const m = String(p.name ?? '').match(/#(\w+)$/)
      if (m && m[1]) {
        try { fetchAbortRef.current?.abort() } catch (e) {}
        const ac = new AbortController()
        fetchAbortRef.current = ac
        ;(async () => {
          try {
            const res = await fetch(`/api/infra/id?id=${encodeURIComponent(m[1])}`, { signal: ac.signal, credentials: 'same-origin' })
            if (!res.ok) return
            const j = await res.json().catch(() => null)
            if (j && j.name) setTitle(j.name)
          } catch (e) {}
        })()
      }
    } catch (e) {}
  }, [open, contentKey])

  const value = React.useMemo(() => ({ open, title, html, contentKey, openPanel, closePanel, togglePanel }), [open, title, html, contentKey, openPanel, closePanel, togglePanel])

  // cleanup pending timeouts / fetches on unmount
  React.useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current)
        pendingTimeoutRef.current = null
      }
      try { fetchAbortRef.current?.abort() } catch (e) {}
    }
  }, [])

  return (
    <LeftPanelContext.Provider value={value}>
      {children}
    </LeftPanelContext.Provider>
  )
}

export function useLeftPanel() {
  const ctx = React.useContext(LeftPanelContext)
  if (!ctx) throw new Error('useLeftPanel must be used within LeftPanelProvider')
  return ctx
}

export default LeftPanelContext
