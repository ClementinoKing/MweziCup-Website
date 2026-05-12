import { 
  ArrowRight, 
  ImageUp, 
  Plus, 
  RotateCcw, 
  Save, 
  Sparkles, 
  Type, 
  Eye,
  Heading,
  AlignLeft,
  MousePointerClick,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import PageHeader from '../components/PageHeader';
import { mockHomepageContent } from '../data/mockAdminData';
import type { HomepageContent } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15 transition-all';

export default function HomepageManager() {
  const [content, setContent] = useState<HomepageContent>(mockHomepageContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (updates: Partial<HomepageContent>) => {
    setContent({ ...content, ...updates });
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const handleReset = () => {
    setContent(mockHomepageContent);
    setHasChanges(false);
    setSaveStatus('idle');
  };

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

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Homepage editor"
        title="Homepage Manager"
        description="Update the hero, marquee, product callouts, and CTA areas without touching the public layout."
        actions={
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Changes saved</span>
              </div>
            )}
            {hasChanges && saveStatus === 'idle' && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Unsaved changes</span>
              </div>
            )}
            <Button 
              variant="outline" 
              className="rounded-full shadow-sm hover:shadow-md transition-all" 
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button 
              className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep shadow-md hover:shadow-lg transition-all" 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {/* Hero Content */}
          <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-mwezi-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mwezi-primary/10">
                  <Heading className="h-5 w-5 text-mwezi-primary" />
                </div>
                <div>
                  <CardTitle>Hero content</CardTitle>
                  <CardDescription>Main banner section that visitors see first</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Heading className="h-4 w-4 text-muted-foreground" />
                    Hero title
                  </label>
                  <Input
                    value={content.heroTitle}
                    onChange={(event) => handleChange({ heroTitle: event.target.value })}
                    className={inputClassName}
                    placeholder="Flow through every day with confidence."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Hero subtitle
                  </label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={(event) => handleChange({ heroSubtitle: event.target.value })}
                    className="min-h-[120px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="Keep the homepage aligned with the Mwezi Cup brand story..."
                  />
                </div>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                      CTA button text
                    </label>
                    <Input
                      value={content.ctaButtonText}
                      onChange={(event) => handleChange({ ctaButtonText: event.target.value })}
                      className={inputClassName}
                      placeholder="Shop Mwezi Cup"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Image note
                    </label>
                    <Input 
                      value="Hero background image placeholder" 
                      readOnly 
                      className={cn(inputClassName, "bg-muted/50 cursor-not-allowed")} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group rounded-3xl border-2 border-dashed border-border/60 bg-gradient-to-br from-mwezi-cream/40 to-mwezi-cream/20 p-5 transition-all hover:border-mwezi-primary/30 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageUp className="h-4 w-4 text-mwezi-primary" />
                    <p className="text-sm font-semibold text-foreground">Hero background</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground truncate flex-1">{content.heroBackgroundImage}</p>
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
                      <ImageUp className="h-3.5 w-3.5" />
                      Upload
                    </Button>
                  </div>
                </div>
                
                <div className="group rounded-3xl border-2 border-dashed border-border/60 bg-gradient-to-br from-mwezi-cream/40 to-mwezi-cream/20 p-5 transition-all hover:border-mwezi-primary/30 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageUp className="h-4 w-4 text-mwezi-primary" />
                    <p className="text-sm font-semibold text-foreground">Product image</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground truncate flex-1">{content.productImage}</p>
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all">
                      <ImageUp className="h-3.5 w-3.5" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marquee Words */}
          <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div>
                    <CardTitle>Marquee words</CardTitle>
                    <CardDescription>Scrolling text highlights across the page</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-sm hover:shadow-md transition-all"
                  onClick={() =>
                    handleChange({
                      marqueeWords: [...content.marqueeWords, 'New marquee word'],
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add word
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 pt-6">
              {content.marqueeWords.map((word, index) => (
                <div key={`${word}-${index}`} className="group relative rounded-2xl border-2 border-border/70 bg-gradient-to-br from-white to-purple-50/20 dark:from-gray-900 dark:to-purple-950/10 p-4 transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Word {index + 1}
                    </label>
                    {content.marqueeWords.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const next = content.marqueeWords.filter((_, i) => i !== index);
                          handleChange({ marqueeWords: next });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={word}
                    onChange={(event) => {
                      const next = [...content.marqueeWords];
                      next[index] = event.target.value;
                      handleChange({ marqueeWords: next });
                    }}
                    className={inputClassName}
                    placeholder="Enter marquee word"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feature Blocks */}
          <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-green-50/30 to-transparent dark:from-green-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <Sparkles className="h-5 w-5 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <CardTitle>Feature blocks</CardTitle>
                  <CardDescription>Key product benefits and features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {content.featureBlocks.map((block, index) => (
                <div key={block.id} className="rounded-3xl border-2 border-border/70 bg-gradient-to-br from-green-50/20 to-white dark:from-green-950/10 dark:to-gray-900 p-5 transition-all hover:border-green-300 dark:hover:border-green-700 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-xs font-semibold text-green-600 dark:text-green-500">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Feature {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Title</label>
                      <Input
                        value={block.title}
                        onChange={(event) => {
                          const next = content.featureBlocks.map((item) => 
                            (item.id === block.id ? { ...item, title: event.target.value } : item)
                          );
                          handleChange({ featureBlocks: next });
                        }}
                        className={inputClassName}
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Input
                        value={block.description}
                        onChange={(event) => {
                          const next = content.featureBlocks.map((item) =>
                            item.id === block.id ? { ...item, description: event.target.value } : item
                          );
                          handleChange({ featureBlocks: next });
                        }}
                        className={inputClassName}
                        placeholder="Feature description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA Sections */}
          <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-orange-50/30 to-transparent dark:from-orange-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                  <Type className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <CardTitle>CTA sections</CardTitle>
                  <CardDescription>Call-to-action buttons throughout the page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {content.ctaSections.map((section, index) => (
                <div key={section.id} className="rounded-3xl border-2 border-border/70 bg-gradient-to-br from-orange-50/20 to-white dark:from-orange-950/10 dark:to-gray-900 p-5 transition-all hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10 text-xs font-semibold text-orange-600 dark:text-orange-500">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      CTA Section {index + 1}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_0.9fr]">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Title</label>
                      <Input
                        value={section.title}
                        onChange={(event) => {
                          const next = content.ctaSections.map((item) => 
                            (item.id === section.id ? { ...item, title: event.target.value } : item)
                          );
                          handleChange({ ctaSections: next });
                        }}
                        className={inputClassName}
                        placeholder="CTA title"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Input
                        value={section.description}
                        onChange={(event) => {
                          const next = content.ctaSections.map((item) => 
                            (item.id === section.id ? { ...item, description: event.target.value } : item)
                          );
                          handleChange({ ctaSections: next });
                        }}
                        className={inputClassName}
                        placeholder="CTA description"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Button text</label>
                      <Input
                        value={section.buttonText}
                        onChange={(event) => {
                          const next = content.ctaSections.map((item) => 
                            (item.id === section.id ? { ...item, buttonText: event.target.value } : item)
                          );
                          handleChange({ ctaSections: next });
                        }}
                        className={inputClassName}
                        placeholder="Button text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="sticky top-6 overflow-hidden border-border/80 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See your changes in real-time</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {/* Hero Preview */}
            <div className="bg-gradient-to-br from-mwezi-hero to-mwezi-cream/50 px-6 py-8 border-b border-border/30">
              <div className="inline-flex items-center gap-2 rounded-full bg-mwezi-primary/10 px-3 py-1 mb-4">
                <Sparkles className="h-3 w-3 text-mwezi-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mwezi-deep">
                  Hero Section
                </p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                {content.heroTitle}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {content.heroSubtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {content.marqueeWords.slice(0, 3).map((word, idx) => (
                  <span 
                    key={`preview-${word}-${idx}`} 
                    className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-mwezi-deep shadow-sm border border-mwezi-primary/10"
                  >
                    {word}
                  </span>
                ))}
                {content.marqueeWords.length > 3 && (
                  <span className="rounded-full bg-mwezi-primary/10 px-3 py-1.5 text-xs font-medium text-mwezi-primary">
                    +{content.marqueeWords.length - 3} more
                  </span>
                )}
              </div>
              <Button className="mt-6 rounded-full bg-mwezi-primary hover:bg-mwezi-deep shadow-md hover:shadow-lg transition-all">
                {content.ctaButtonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="space-y-5 p-6">
              {/* Images Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">Images</h4>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border-2 border-border/70 bg-gradient-to-br from-mwezi-cream/30 to-white dark:to-gray-900 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Hero background</p>
                    <p className="text-xs text-foreground truncate">{content.heroBackgroundImage}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-border/70 bg-gradient-to-br from-mwezi-cream/30 to-white dark:to-gray-900 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Product image</p>
                    <p className="text-xs text-foreground truncate">{content.productImage}</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Blocks Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <h4 className="text-sm font-semibold text-foreground">Feature blocks</h4>
                </div>
                <div className="space-y-2">
                  {content.featureBlocks.map((block, idx) => (
                    <div 
                      key={block.id} 
                      className="rounded-2xl bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-gray-900 border border-green-200/50 dark:border-green-800/30 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-bold text-green-600 dark:text-green-500">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{block.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{block.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA Sections Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <MousePointerClick className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                  <h4 className="text-sm font-semibold text-foreground">CTA sections</h4>
                </div>
                <div className="space-y-2">
                  {content.ctaSections.map((section, idx) => (
                    <div 
                      key={section.id} 
                      className="rounded-2xl bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-950/20 dark:to-gray-900 border border-orange-200/50 dark:border-orange-800/30 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-500">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{section.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{section.description}</p>
                          <Button 
                            size="sm" 
                            className="mt-2 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-xs"
                          >
                            {section.buttonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
