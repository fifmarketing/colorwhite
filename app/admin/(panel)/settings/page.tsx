'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'
import type { TopBarIcon } from '@/lib/default-content'

const iconOptions: { value: TopBarIcon; label: string }[] = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'truck', label: 'Delivery' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'shield', label: 'Authentic / Secure' },
]

export default function AdminSettingsPage() {
  const { data, mutate } = useSiteSettings()
  const settings = data?.settings

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Top bar messages, footer details, payment methods, shipping charges, and SEO metadata.
        </p>
      </div>

      <SectionCard
        title="Top Bar"
        description="The thin trust strip shown above the header on every page."
        section="topBar"
        initial={settings?.topBar}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => {
          const items = draft.items ?? []
          return (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="topbar-enabled"
                  checked={draft.enabled}
                  onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked })}
                />
                <Label htmlFor="topbar-enabled">Show top bar</Label>
              </div>

              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex flex-col gap-2 sm:w-56">
                    <Label>Icon</Label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) =>
                        setDraft({
                          ...draft,
                          items: items.map((it, i) =>
                            i === index ? { ...it, icon: value as TopBarIcon } : it
                          ),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <Label>Message</Label>
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          items: items.map((it, i) =>
                            i === index ? { ...it, text: e.target.value } : it
                          ),
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Remove message"
                    onClick={() =>
                      setDraft({ ...draft, items: items.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() =>
                  setDraft({ ...draft, items: [...items, { icon: 'truck', text: '' }] })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Message
              </Button>
            </div>
          )
        }}
      </SectionCard>

      <SectionCard
        title="Footer"
        description="Brand blurb, social links and the contact details shown in the footer columns."
        section="footer"
        initial={settings?.footer}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>About Text</Label>
              <Textarea
                rows={3}
                value={draft.aboutText}
                onChange={(e) => setDraft({ ...draft, aboutText: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone Number</Label>
                <Input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>WhatsApp Number</Label>
                <Input
                  value={draft.whatsapp}
                  onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })}
                  placeholder="+923001234567"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Support Hours</Label>
                <Input
                  value={draft.hours}
                  onChange={(e) => setDraft({ ...draft, hours: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Address</Label>
                <Input
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Instagram URL</Label>
                <Input
                  value={draft.instagramUrl}
                  onChange={(e) => setDraft({ ...draft, instagramUrl: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Facebook URL</Label>
                <Input
                  value={draft.facebookUrl}
                  onChange={(e) => setDraft({ ...draft, facebookUrl: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>TikTok URL</Label>
                <Input
                  value={draft.tiktokUrl}
                  onChange={(e) => setDraft({ ...draft, tiktokUrl: e.target.value })}
                  placeholder="Leave empty to hide"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>YouTube URL</Label>
                <Input
                  value={draft.youtubeUrl}
                  onChange={(e) => setDraft({ ...draft, youtubeUrl: e.target.value })}
                  placeholder="Leave empty to hide"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label>Copyright Text</Label>
                <Input
                  value={draft.copyrightText}
                  onChange={(e) => setDraft({ ...draft, copyrightText: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="footer-badges"
                checked={draft.showPaymentBadges}
                onCheckedChange={(checked) => setDraft({ ...draft, showPaymentBadges: checked })}
              />
              <Label htmlFor="footer-badges">Show payment method badges</Label>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="WhatsApp"
        description="The floating WhatsApp chat button shown on the website."
        section="whatsapp"
        initial={settings?.whatsapp}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-2 max-w-sm">
            <Label>Phone Number</Label>
            <Input
              value={draft.phoneNumber}
              onChange={(e) => setDraft({ ...draft, phoneNumber: e.target.value })}
              placeholder="+923001234567"
            />
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Shipping & Delivery"
        description="Charges and delivery timings shown on the cart, checkout and product pages."
        section="checkout"
        initial={settings?.checkout}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Shipping Cost (Rs.)</Label>
                <Input
                  type="number"
                  min={0}
                  value={draft.shippingCost}
                  onChange={(e) =>
                    setDraft({ ...draft, shippingCost: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Free Delivery Above (Rs.)</Label>
                <Input
                  type="number"
                  min={0}
                  value={draft.freeShippingThreshold}
                  onChange={(e) =>
                    setDraft({ ...draft, freeShippingThreshold: Number(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">Set to 0 to disable free delivery.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Delivery Estimate</Label>
                <Input
                  value={draft.deliveryEstimate}
                  onChange={(e) => setDraft({ ...draft, deliveryEstimate: e.target.value })}
                  placeholder="3 to 5 working days"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Shipping Note</Label>
                <Input
                  value={draft.shippingNote}
                  onChange={(e) => setDraft({ ...draft, shippingNote: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Payment Methods"
        description="Payment options offered at checkout, including your bank transfer details."
        section="payment"
        initial={settings?.payment}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="cod-enabled"
                  checked={draft.codEnabled}
                  onCheckedChange={(checked) => setDraft({ ...draft, codEnabled: checked })}
                />
                <Label htmlFor="cod-enabled">Enable Cash on Delivery</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>COD Label</Label>
                  <Input
                    value={draft.codLabel}
                    onChange={(e) => setDraft({ ...draft, codLabel: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>COD Description</Label>
                  <Input
                    value={draft.codDescription}
                    onChange={(e) => setDraft({ ...draft, codDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <Switch
                  id="bank-enabled"
                  checked={draft.bankEnabled}
                  onCheckedChange={(checked) => setDraft({ ...draft, bankEnabled: checked })}
                />
                <Label htmlFor="bank-enabled">Enable Bank Transfer</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Method Label</Label>
                  <Input
                    value={draft.bankLabel}
                    onChange={(e) => setDraft({ ...draft, bankLabel: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={draft.bankName}
                    onChange={(e) => setDraft({ ...draft, bankName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Account Title</Label>
                  <Input
                    value={draft.accountTitle}
                    onChange={(e) => setDraft({ ...draft, accountTitle: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Account Number</Label>
                  <Input
                    value={draft.accountNumber}
                    onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>IBAN</Label>
                  <Input
                    value={draft.iban}
                    onChange={(e) => setDraft({ ...draft, iban: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Instructions</Label>
                <Textarea
                  rows={3}
                  value={draft.bankInstructions}
                  onChange={(e) => setDraft({ ...draft, bankInstructions: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="require-proof"
                  checked={draft.requireProof}
                  onCheckedChange={(checked) => setDraft({ ...draft, requireProof: checked })}
                />
                <Label htmlFor="require-proof">Require payment screenshot before ordering</Label>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Reviews Page"
        description="Headings for the customer reviews page. Wrap a word in *asterisks* for the accent color."
        section="reviewsPage"
        initial={settings?.reviewsPage}
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
            <div className="flex flex-col gap-2">
              <Label>Privacy Note</Label>
              <Input
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              />
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Categories Page"
        description="Headings for the shop-by-category page."
        section="categoriesPage"
        initial={settings?.categoriesPage}
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
        title="SEO"
        description="Browser tab title and meta description for search engines."
        section="seo"
        initial={settings?.seo}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Site Title</Label>
              <Input
                value={draft.siteTitle}
                onChange={(e) => setDraft({ ...draft, siteTitle: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Site Description</Label>
              <Textarea
                rows={3}
                value={draft.siteDescription}
                onChange={(e) => setDraft({ ...draft, siteDescription: e.target.value })}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
