'use client'

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'
import { ImageUploadField } from '@/components/admin/image-upload'
import type { HeroSlide } from '@/lib/default-content'

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
        title="Home Slider"
        description="Slides shown at the top of the homepage. Add two or more slides to enable the rotating slider — with a single slide it stays a static hero."
        section="heroSlides"
        initial={settings?.heroSlides}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => {
          const slides = draft.slides ?? []
          const updateSlide = (index: number, patch: Partial<HeroSlide>) =>
            setDraft({
              ...draft,
              slides: slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
            })
          const move = (index: number, direction: -1 | 1) => {
            const target = index + direction
            if (target < 0 || target >= slides.length) return
            const next = [...slides]
            ;[next[index], next[target]] = [next[target], next[index]]
            setDraft({ ...draft, slides: next })
          }

          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 sm:max-w-[220px]">
                <Label htmlFor="slider-autoplay">Autoplay (seconds)</Label>
                <Input
                  id="slider-autoplay"
                  type="number"
                  min={0}
                  value={draft.autoplaySeconds}
                  onChange={(e) =>
                    setDraft({ ...draft, autoplaySeconds: Number(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">Set to 0 to disable autoplay.</p>
              </div>

              {slides.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No slides yet. Add one to control the homepage hero.
                </p>
              )}

              {slides.map((slide, index) => (
                <div key={index} className="rounded-lg border border-border p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">Slide {index + 1}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Move slide up"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Move slide down"
                        disabled={index === slides.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Delete slide"
                        onClick={() =>
                          setDraft({ ...draft, slides: slides.filter((_, i) => i !== index) })
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Title</Label>
                    <Input
                      value={slide.title}
                      onChange={(e) => updateSlide(index, { title: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={slide.description}
                      onChange={(e) => updateSlide(index, { description: e.target.value })}
                    />
                  </div>
                  <ImageUploadField
                    id={`slide-image-${index}`}
                    label="Slide Image"
                    folder="content"
                    value={slide.image}
                    onChange={(url) => updateSlide(index, { image: url })}
                    placeholder="/hero-img.jpg"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Button Text</Label>
                      <Input
                        value={slide.buttonText}
                        onChange={(e) => updateSlide(index, { buttonText: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Button Link</Label>
                      <Input
                        value={slide.buttonLink}
                        onChange={(e) => updateSlide(index, { buttonLink: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() =>
                  setDraft({
                    ...draft,
                    slides: [
                      ...slides,
                      {
                        title: '',
                        description: '',
                        image: '',
                        buttonText: 'Shop Now',
                        buttonLink: '/shop',
                      },
                    ],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
            </div>
          )
        }}
      </SectionCard>

      <SectionCard
        title="Hero Section (legacy fallback)"
        description="Used only when the Home Slider has no slides."
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
            <ImageUploadField
              id="hero-image"
              label="Hero Image"
              folder="content"
              value={draft.image}
              onChange={(url) => setDraft({ ...draft, image: url })}
              placeholder="/hero-img.jpg"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <ImageUploadField
              id="promo-image"
              label="Popup Image"
              folder="content"
              value={draft.image}
              onChange={(url) => setDraft({ ...draft, image: url })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
