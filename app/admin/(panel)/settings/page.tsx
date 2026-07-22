'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionCard, useSiteSettings } from '@/components/admin/settings-section'

export default function AdminSettingsPage() {
  const { data, mutate } = useSiteSettings()
  const settings = data?.settings

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Footer links, WhatsApp number, shipping cost, and SEO metadata.
        </p>
      </div>

      <SectionCard
        title="Footer"
        section="footer"
        initial={settings?.footer}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
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
              <Label>Copyright Text</Label>
              <Input
                value={draft.copyrightText}
                onChange={(e) => setDraft({ ...draft, copyrightText: e.target.value })}
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
        title="Checkout"
        section="checkout"
        initial={settings?.checkout}
        onSaved={() => mutate()}
      >
        {(draft, setDraft) => (
          <div className="flex flex-col gap-2 max-w-sm">
            <Label>Shipping Cost (Rs.)</Label>
            <Input
              type="number"
              min={0}
              value={draft.shippingCost}
              onChange={(e) => setDraft({ ...draft, shippingCost: Number(e.target.value) || 0 })}
            />
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
