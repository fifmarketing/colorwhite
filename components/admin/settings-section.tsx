'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SiteSettings } from '@/lib/default-content'

export const settingsFetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSiteSettings() {
  return useSWR<{ settings: SiteSettings }>('/api/admin/settings', settingsFetcher)
}

export async function saveSettingsSection(section: string, data: unknown) {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, data }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to save')
  }
}

interface SectionCardProps<T> {
  title: string
  description?: string
  section: string
  initial: T | undefined
  onSaved?: () => void
  children: (draft: T, setDraft: (next: T) => void) => React.ReactNode
}

export function SectionCard<T>({
  title,
  description,
  section,
  initial,
  onSaved,
  children,
}: SectionCardProps<T>) {
  const [draft, setDraft] = useState<T | undefined>(initial)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  // Sync draft when settings load
  useEffect(() => {
    if (initial !== undefined && draft === undefined) {
      setDraft(initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  if (draft === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  const handleSave = async () => {
    setBusy(true)
    setStatus('idle')
    try {
      await saveSettingsSection(section, draft)
      setStatus('saved')
      onSaved?.()
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children(draft, setDraft)}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={busy}>
            {busy ? 'Saving...' : 'Save Changes'}
          </Button>
          {status === 'saved' && <p className="text-sm text-green-600">Saved</p>}
          {status === 'error' && <p className="text-sm text-destructive">Failed to save</p>}
        </div>
      </CardContent>
    </Card>
  )
}
