'use client'

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'
import type { PolicyContent } from '@/lib/default-content'

const policyKeys = [
  { key: 'shipping', label: 'Shipping Policy', path: '/shipping-policy' },
  { key: 'returns', label: 'Return and Exchange Policy', path: '/returns-policy' },
  { key: 'privacy', label: 'Privacy Policy', path: '/privacy-policy' },
  { key: 'terms', label: 'Terms and Conditions', path: '/terms' },
] as const

type PolicyKey = (typeof policyKeys)[number]['key']

export default function AdminPolicies() {
  const { data, mutate } = useSiteSettings()
  const settings = data?.settings

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Policies &amp; FAQs</h1>
        <p className="text-sm text-muted-foreground">
          Edit the wording of your policy pages and the questions shown on the FAQs page.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">Formatting tips</p>
        <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
          <li>Start a line with {'"## "'} to create a section heading.</li>
          <li>Start a line with {'"- "'} to create a bullet point.</li>
          <li>Leave a blank line between paragraphs.</li>
        </ul>
      </div>

      {policyKeys.map(({ key, label, path }) => (
        <PolicySection
          key={key}
          policyKey={key}
          label={label}
          path={path}
          initial={settings?.policies?.[key]}
          onSaved={() => mutate()}
        />
      ))}

      <SectionCard
        title="FAQs Page"
        description="Shown at /faqs. Questions are grouped automatically by their category label."
        section="faqs"
        initial={settings?.faqs}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => {
          const items = draft.items ?? []
          const update = (index: number, patch: Partial<(typeof items)[number]>) =>
            setDraft({
              ...draft,
              items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
            })
          const move = (index: number, direction: -1 | 1) => {
            const target = index + direction
            if (target < 0 || target >= items.length) return
            const next = [...items]
            ;[next[index], next[target]] = [next[target], next[index]]
            setDraft({ ...draft, items: next })
          }
          const categories = [...new Set(items.map((i) => i.category).filter(Boolean))]

          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="faq-title">Page Title</Label>
                <Input
                  id="faq-title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="faq-subtitle">Subtitle</Label>
                <Textarea
                  id="faq-subtitle"
                  rows={2}
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">Question {index + 1}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Move question up"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Move question down"
                          disabled={index === items.length - 1}
                          onClick={() => move(index, 1)}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Delete question"
                          onClick={() =>
                            setDraft({ ...draft, items: items.filter((_, i) => i !== index) })
                          }
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Category</Label>
                      <Input
                        list="faq-categories"
                        value={item.category}
                        onChange={(e) => update(index, { category: e.target.value })}
                        placeholder="e.g. Delivery"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => update(index, { question: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Answer</Label>
                      <Textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => update(index, { answer: e.target.value })}
                      />
                    </div>
                  </div>
                ))}

                <datalist id="faq-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>

                <Button
                  type="button"
                  variant="outline"
                  className="self-start"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      items: [...items, { category: '', question: '', answer: '' }],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>
          )
        }}
      </SectionCard>
    </div>
  )
}

function PolicySection({
  policyKey,
  label,
  path,
  initial,
  onSaved,
}: {
  policyKey: PolicyKey
  label: string
  path: string
  initial: PolicyContent | undefined
  onSaved: () => void
}) {
  return (
    <SectionCard<PolicyContent>
      title={label}
      description={`Shown at ${path}`}
      section={`policies.${policyKey}`}
      initial={initial}
      onSaved={onSaved}
    >
      {(draft, setDraft) => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${policyKey}-title`}>Page Title</Label>
            <Input
              id={`${policyKey}-title`}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${policyKey}-intro`}>Intro</Label>
            <Textarea
              id={`${policyKey}-intro`}
              rows={2}
              value={draft.intro}
              onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${policyKey}-body`}>Body</Label>
            <Textarea
              id={`${policyKey}-body`}
              rows={16}
              className="font-mono text-xs"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </div>
        </div>
      )}
    </SectionCard>
  )
}
