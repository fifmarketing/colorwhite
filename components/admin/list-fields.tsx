'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

function RowControls({
  index,
  total,
  onMove,
  onRemove,
  label,
}: {
  index: number
  total: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
  label: string
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label={`Move ${label} ${index + 1} up`}
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label={`Move ${label} ${index + 1} down`}
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onRemove(index)}
        aria-label={`Remove ${label} ${index + 1}`}
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  )
}

/** Editor for a simple ordered list of strings (benefits, steps, image paths). */
export function StringListField({
  label,
  hint,
  placeholder,
  itemLabel,
  values,
  onChange,
  multiline = false,
}: {
  label: string
  hint?: string
  placeholder?: string
  itemLabel: string
  values: string[]
  onChange: (next: string[]) => void
  multiline?: boolean
}) {
  const update = (index: number, value: string) =>
    onChange(values.map((v, i) => (i === index ? value : v)))
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index))
  const move = (from: number, to: number) => {
    const next = [...values]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>{label}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex flex-col gap-2">
        {values.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
            No {itemLabel.toLowerCase()}s yet.
          </p>
        )}
        {values.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2.5 w-5 shrink-0 text-right text-xs text-muted-foreground">
              {index + 1}.
            </span>
            {multiline ? (
              <Textarea
                value={value}
                rows={2}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
                aria-label={`${itemLabel} ${index + 1}`}
              />
            ) : (
              <Input
                value={value}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
                aria-label={`${itemLabel} ${index + 1}`}
              />
            )}
            <RowControls
              index={index}
              total={values.length}
              onMove={move}
              onRemove={remove}
              label={itemLabel}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...values, ''])}
      >
        <Plus className="h-4 w-4" />
        Add {itemLabel}
      </Button>
    </div>
  )
}

/** Editor for a list of two-field objects (features, FAQs). */
export function PairListField<K1 extends string, K2 extends string>({
  label,
  hint,
  itemLabel,
  keys,
  labels,
  placeholders,
  values,
  onChange,
}: {
  label: string
  hint?: string
  itemLabel: string
  keys: [K1, K2]
  labels: [string, string]
  placeholders?: [string, string]
  values: Record<string, string>[]
  onChange: (next: Record<string, string>[]) => void
}) {
  const [keyA, keyB] = keys
  const update = (index: number, key: string, value: string) =>
    onChange(values.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index))
  const move = (from: number, to: number) => {
    const next = [...values]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>{label}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex flex-col gap-3">
        {values.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
            No {itemLabel.toLowerCase()}s yet.
          </p>
        )}
        {values.map((row, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border border-border p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Input
                value={row[keyA] ?? ''}
                placeholder={placeholders?.[0]}
                onChange={(e) => update(index, keyA, e.target.value)}
                aria-label={`${itemLabel} ${index + 1} ${labels[0]}`}
              />
              <Textarea
                value={row[keyB] ?? ''}
                rows={3}
                placeholder={placeholders?.[1]}
                onChange={(e) => update(index, keyB, e.target.value)}
                aria-label={`${itemLabel} ${index + 1} ${labels[1]}`}
              />
            </div>
            <RowControls
              index={index}
              total={values.length}
              onMove={move}
              onRemove={remove}
              label={itemLabel}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...values, { [keyA]: '', [keyB]: '' }])}
      >
        <Plus className="h-4 w-4" />
        Add {itemLabel}
      </Button>
    </div>
  )
}
