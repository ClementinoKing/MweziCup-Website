import { ImageUp, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageHeader from '../components/PageHeader';
import { mockSiteSettings } from '../data/mockAdminData';
import type { SiteSettings } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15';

const socialFields: Array<{ label: string; key: keyof Pick<SiteSettings, 'facebookLink' | 'instagramLink' | 'tiktokLink'> }> = [
  { label: 'Facebook link', key: 'facebookLink' },
  { label: 'Instagram link', key: 'instagramLink' },
  { label: 'TikTok link', key: 'tiktokLink' },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  const [savedAt, setSavedAt] = useState('Unsaved changes');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Manage brand details, contact information, social links, SEO, and footer copy from one place."
        actions={
          <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" onClick={() => setSavedAt('Saved just now')}>
            <Save className="h-4 w-4" />
            Save settings
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{savedAt}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website name</label>
              <Input value={settings.websiteName} onChange={(event) => setSettings({ ...settings, websiteName: event.target.value })} className={inputClassName} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-dashed border-border/80 bg-mwezi-cream p-4">
                <p className="text-sm font-medium text-foreground">Logo upload</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{settings.logoUrl}</p>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ImageUp className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-dashed border-border/80 bg-mwezi-cream p-4">
                <p className="text-sm font-medium text-foreground">Favicon upload</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{settings.faviconUrl}</p>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ImageUp className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>Contact Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contact email</label>
              <Input value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} className={inputClassName} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone number</label>
                <Input value={settings.phoneNumber} onChange={(event) => setSettings({ ...settings, phoneNumber: event.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">WhatsApp number</label>
                <Input value={settings.whatsappNumber} onChange={(event) => setSettings({ ...settings, whatsappNumber: event.target.value })} className={inputClassName} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {socialFields.map(({ label, key }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <Input
                  value={settings[key]}
                  onChange={(event) => setSettings({ ...settings, [key]: event.target.value })}
                  className={inputClassName}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SEO title</label>
              <Input value={settings.seoTitle} onChange={(event) => setSettings({ ...settings, seoTitle: event.target.value })} className={inputClassName} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SEO description</label>
              <textarea
                value={settings.seoDescription}
                onChange={(event) => setSettings({ ...settings, seoDescription: event.target.value })}
                className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Footer Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Footer text</label>
              <textarea
                value={settings.footerText}
                onChange={(event) => setSettings({ ...settings, footerText: event.target.value })}
                className="min-h-[110px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
