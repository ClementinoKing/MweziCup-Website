import { 
  ImageUp, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Music2, 
  Search, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageHeader from '../components/PageHeader';
import { mockSiteSettings } from '../data/mockAdminData';
import type { SiteSettings } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15 transition-all';

const socialFields: Array<{ 
  label: string; 
  key: keyof Pick<SiteSettings, 'facebookLink' | 'instagramLink' | 'tiktokLink'>;
  icon: React.ElementType;
  placeholder: string;
}> = [
  { label: 'Facebook', key: 'facebookLink', icon: Facebook, placeholder: 'https://facebook.com/mwezicup' },
  { label: 'Instagram', key: 'instagramLink', icon: Instagram, placeholder: 'https://instagram.com/mwezicup' },
  { label: 'TikTok', key: 'tiktokLink', icon: Music2, placeholder: 'https://tiktok.com/@mwezicup' },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setHasChanges(false);
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  };

  const handleChange = (updates: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...updates });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Manage brand details, contact information, social links, SEO, and footer copy from one place."
        actions={
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Changes saved</span>
              </div>
            )}
            {hasChanges && saveStatus === 'idle' && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-4 w-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            <Button 
              className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep shadow-md hover:shadow-lg transition-all" 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save settings'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* General Settings */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-mwezi-cream/30 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mwezi-primary/10">
                <Globe className="h-5 w-5 text-mwezi-primary" />
              </div>
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic website information and branding</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Website name
              </label>
              <Input 
                value={settings.websiteName} 
                onChange={(event) => handleChange({ websiteName: event.target.value })} 
                className={inputClassName}
                placeholder="Enter website name"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-3xl border-2 border-dashed border-border/60 bg-gradient-to-br from-mwezi-cream/40 to-mwezi-cream/20 p-5 transition-all hover:border-mwezi-primary/30 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <ImageUp className="h-4 w-4 text-mwezi-primary" />
                  <p className="text-sm font-semibold text-foreground">Logo upload</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate flex-1">{settings.logoUrl}</p>
                  <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
                    <ImageUp className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>
              </div>
              
              <div className="group rounded-3xl border-2 border-dashed border-border/60 bg-gradient-to-br from-mwezi-cream/40 to-mwezi-cream/20 p-5 transition-all hover:border-mwezi-primary/30 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <ImageUp className="h-4 w-4 text-mwezi-primary" />
                  <p className="text-sm font-semibold text-foreground">Favicon upload</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate flex-1">{settings.faviconUrl}</p>
                  <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
                    <ImageUp className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <CardTitle>Contact Settings</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Contact email
              </label>
              <Input 
                type="email"
                value={settings.contactEmail} 
                onChange={(event) => handleChange({ contactEmail: event.target.value })} 
                className={inputClassName}
                placeholder="hello@example.com"
              />
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone number
                </label>
                <Input 
                  type="tel"
                  value={settings.phoneNumber} 
                  onChange={(event) => handleChange({ phoneNumber: event.target.value })} 
                  className={inputClassName}
                  placeholder="+265 888 555 900"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  WhatsApp number
                </label>
                <Input 
                  type="tel"
                  value={settings.whatsappNumber} 
                  onChange={(event) => handleChange({ whatsappNumber: event.target.value })} 
                  className={inputClassName}
                  placeholder="+265 888 555 901"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <Facebook className="h-5 w-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            {socialFields.map(({ label, key, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </label>
                <Input
                  value={settings[key]}
                  onChange={(event) => handleChange({ [key]: event.target.value })}
                  className={inputClassName}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <Search className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                SEO title
              </label>
              <Input 
                value={settings.seoTitle} 
                onChange={(event) => handleChange({ seoTitle: event.target.value })} 
                className={inputClassName}
                placeholder="Mwezi Cup | Comfortable reusable menstrual care"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {settings.seoTitle.length}/60 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                SEO description
              </label>
              <textarea
                value={settings.seoDescription}
                onChange={(event) => handleChange({ seoDescription: event.target.value })}
                className="min-h-[120px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                placeholder="Premium reusable menstrual care built for comfort, sustainability, and life on your terms."
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {settings.seoDescription.length}/160 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Settings */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow xl:col-span-2">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-orange-50/30 to-transparent dark:from-orange-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <CardTitle>Footer Settings</CardTitle>
                <CardDescription>Customize your website footer content</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Footer text
              </label>
              <textarea
                value={settings.footerText}
                onChange={(event) => handleChange({ footerText: event.target.value })}
                className="min-h-[110px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                placeholder="Mwezi Cup is built for comfort, sustainability, and life on your terms."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
