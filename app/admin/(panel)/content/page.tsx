'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'

export default function AdminContentPage() {
  const { data, mutate } = useSiteSettings()
  const settings = data?.settings

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Homepage Content</h1>
        <p className="text-sm text-muted-foreground">
          Edit the hero, section headings, promo banner, and call-to-action shown on the homepage.
          Wrap a word in *asterisks* to give it the accent color.
        </p>
      </div>

      <SectionCard
        title="Hero Section"
        section="hero"
        initial={settings?.hero}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hero-desc">Description</Label>
              <Textarea
                id="hero-desc"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-image">Image Path</Label>
                <Input
                  id="hero-image"
                  value={draft.image}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                  placeholder="/hero-img.jpg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-btn-text">Button Text</Label>
                <Input
                  id="hero-btn-text"
                  value={draft.buttonText}
                  onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-btn-link">Button Link</Label>
                <Input
                  id="hero-btn-link"
                  value={draft.buttonLink}
                  onChange={(e) => setDraft({ ...draft, buttonLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Section Headings & CTA"
        description="Headings for the featured products, testimonials, and bottom call-to-action sections."
        section="homeSections"
        initial={settings?.homeSections}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Featured Eyebrow</Label>
                <Input
                  value={draft.featuredEyebrow}
                  onChange={(e) => setDraft({ ...draft, featuredEyebrow: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Featured Title</Label>
                <Input
                  value={draft.featuredTitle}
                  onChange={(e) => setDraft({ ...draft, featuredTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Featured Subtitle</Label>
              <Textarea
                rows={2}
                value={draft.featuredSubtitle}
                onChange={(e) => setDraft({ ...draft, featuredSubtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Testimonials Eyebrow</Label>
                <Input
                  value={draft.testimonialsEyebrow}
                  onChange={(e) => setDraft({ ...draft, testimonialsEyebrow: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Testimonials Title</Label>
                <Input
                  value={draft.testimonialsTitle}
                  onChange={(e) => setDraft({ ...draft, testimonialsTitle: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Testimonials Subtitle</Label>
              <Textarea
                rows={2}
                value={draft.testimonialsSubtitle}
                onChange={(e) => setDraft({ ...draft, testimonialsSubtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>CTA Title</Label>
                <Input
                  value={draft.ctaTitle}
                  onChange={(e) => setDraft({ ...draft, ctaTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>CTA Subtitle</Label>
                <Input
                  value={draft.ctaSubtitle}
                  onChange={(e) => setDraft({ ...draft, ctaSubtitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>CTA Button Text</Label>
                <Input
                  value={draft.ctaButtonText}
                  onChange={(e) => setDraft({ ...draft, ctaButtonText: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>CTA Button Link</Label>
                <Input
                  value={draft.ctaButtonLink}
                  onChange={(e) => setDraft({ ...draft, ctaButtonLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Promo Popup Banner"
        description="The popup shown to visitors when they land on the site."
        section="promoBanner"
        initial={settings?.promoBanner}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="promo-enabled"
                checked={draft.enabled}
                onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked })}
              />
              <Label htmlFor="promo-enabled">Show promo popup</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Offer Text</Label>
                <Input
                  value={draft.offerText}
                  onChange={(e) => setDraft({ ...draft, offerText: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <Textarea
                rows={2}
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Image Path</Label>
                <Input
                  value={draft.image}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button Text</Label>
                <Input
                  value={draft.buttonText}
                  onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input
                  value={draft.buttonLink}
                  onChange={(e) => setDraft({ ...draft, buttonLink: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Auto-close (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  value={draft.durationSeconds}
                  onChange={(e) =>
                    setDraft({ ...draft, durationSeconds: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
