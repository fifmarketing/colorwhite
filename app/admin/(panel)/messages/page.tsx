'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Mail, MailOpen, Trash2, MessageSquare } from 'lucide-react'

interface Message {
  _id: string
  name: string
  email: string
  subject?: string
  message: string
  read?: boolean
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminMessagesPage() {
  const { data, isLoading, mutate } = useSWR<{ messages: Message[] }>(
    '/api/admin/messages',
    fetcher
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const messages = data?.messages ?? []
  const unreadCount = messages.filter((m) => !m.read).length

  const toggleRead = async (msg: Message) => {
    await fetch(`/api/admin/messages/${msg._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !msg.read }),
    })
    mutate()
  }

  const handleExpand = async (msg: Message) => {
    const next = expandedId === msg._id ? null : msg._id
    setExpandedId(next)
    if (next && !msg.read) {
      await fetch(`/api/admin/messages/${msg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      mutate()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setBusy(true)
    await fetch(`/api/admin/messages/${deleteId}`, { method: 'DELETE' })
    setBusy(false)
    setDeleteId(null)
    mutate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} message{messages.length === 1 ? '' : 's'}
          {unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Loading messages...</p>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <Card
              key={msg._id}
              className={msg.read ? '' : 'border-primary/40 bg-primary/5'}
            >
              <CardContent className="p-4">
                <button
                  className="w-full text-left cursor-pointer"
                  onClick={() => handleExpand(msg)}
                  aria-expanded={expandedId === msg._id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground text-sm">{msg.name}</p>
                        {!msg.read && (
                          <Badge className="bg-primary text-primary-foreground">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {msg.subject || msg.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {msg.email} &middot; {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>

                {expandedId === msg._id && (
                  <div className="mt-4 border-t border-border pt-4 flex flex-col gap-3">
                    {msg.subject && (
                      <p className="text-sm font-medium text-foreground">{msg.subject}</p>
                    )}
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button asChild variant="outline" size="sm">
                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}>
                          <Mail className="h-4 w-4 mr-1" />
                          Reply via Email
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleRead(msg)}>
                        {msg.read ? (
                          <>
                            <Mail className="h-4 w-4 mr-1" />
                            Mark Unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="h-4 w-4 mr-1" />
                            Mark Read
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(msg._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the message. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy}>
              {busy ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
