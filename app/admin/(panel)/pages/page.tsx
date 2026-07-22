'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminPagesPage() {
  const { data, mutate } = useSiteSettings()
  const settings = data?.settings

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Page Content</h1>
        <p className="text-sm text-muted-foreground">
          Edit the Shop, About, and Contact page content. Wrap a word in *asterisks* to give it
          the accent color.
        </p>
      </div>

      <SectionCard
        title="Shop Page"
        section="shopPage"
        initial={settings?.shopPage}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Eyebrow</Label>
                <Input
                  value={draft.eyebrow}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Subtitle</Label>
              <Textarea
                rows={2}
                value={draft.subtitle}
                onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
              />
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="About Page"
        section="aboutPage"
        initial={settings?.aboutPage}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Hero Eyebrow</Label>
                <Input
                  value={draft.heroEyebrow}
                  onChange={(e) => setDraft({ ...draft, heroEyebrow: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Hero Title</Label>
                <Input
                  value={draft.heroTitle}
                  onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Mission Title</Label>
                <Input
                  value={draft.missionTitle}
                  onChange={(e) => setDraft({ ...draft, missionTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Why Choose Title</Label>
                <Input
                  value={draft.whyChooseTitle}
                  onChange={(e) => setDraft({ ...draft, whyChooseTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mission Text</Label>
              <Textarea
                rows={3}
                value={draft.missionText}
                onChange={(e) => setDraft({ ...draft, missionText: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Why Choose Points</Label>
              {draft.whyChoosePoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={point}
                    onChange={(e) => {
                      const next = [...draft.whyChoosePoints]
                      next[i] = e.target.value
                      setDraft({ ...draft, whyChoosePoints: next })
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Remove point"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        whyChoosePoints: draft.whyChoosePoints.filter((_, j) => j !== i),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() =>
                  setDraft({ ...draft, whyChoosePoints: [...draft.whyChoosePoints, ''] })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Point
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Values Title</Label>
              <Input
                value={draft.valuesTitle}
                onChange={(e) => setDraft({ ...draft, valuesTitle: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Values</Label>
              {draft.values.map((value, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={value.title}
                      placeholder="Value title"
                      onChange={(e) => {
                        const next = [...draft.values]
                        next[i] = { ...next[i], title: e.target.value }
                        setDraft({ ...draft, values: next })
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Remove value"
                      onClick={() =>
                        setDraft({ ...draft, values: draft.values.filter((_, j) => j !== i) })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Textarea
                    rows={2}
                    value={value.desc}
                    placeholder="Value description"
                    onChange={(e) => {
                      const next = [...draft.values]
                      next[i] = { ...next[i], desc: e.target.value }
                      setDraft({ ...draft, values: next })
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() =>
                  setDraft({ ...draft, values: [...draft.values, { title: '', desc: '' }] })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Value
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Vision Title</Label>
              <Input
                value={draft.visionTitle}
                onChange={(e) => setDraft({ ...draft, visionTitle: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Vision Paragraphs</Label>
              {draft.visionParagraphs.map((para, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const next = [...draft.visionParagraphs]
                      next[i] = e.target.value
                      setDraft({ ...draft, visionParagraphs: next })
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Remove paragraph"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        visionParagraphs: draft.visionParagraphs.filter((_, j) => j !== i),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() =>
                  setDraft({ ...draft, visionParagraphs: [...draft.visionParagraphs, ''] })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Paragraph
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Contact Page"
        section="contactPage"
        initial={settings?.contactPage}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Hero Eyebrow</Label>
                <Input
                  value={draft.heroEyebrow}
                  onChange={(e) => setDraft({ ...draft, heroEyebrow: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Hero Title</Label>
                <Input
                  value={draft.heroTitle}
                  onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Hero Subtitle</Label>
              <Textarea
                rows={2}
                value={draft.heroSubtitle}
                onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Info Title</Label>
                <Input
                  value={draft.infoTitle}
                  onChange={(e) => setDraft({ ...draft, infoTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Info Subtitle</Label>
                <Input
                  value={draft.infoSubtitle}
                  onChange={(e) => setDraft({ ...draft, infoSubtitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Address</Label>
              <Textarea
                rows={2}
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
