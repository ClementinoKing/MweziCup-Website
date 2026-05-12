import { ArrowRight, ImageUp, Plus, RotateCcw, Save, Sparkles, Type } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import PageHeader from '../components/PageHeader';
import { mockHomepageContent } from '../data/mockAdminData';
import type { HomepageContent } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15';

export default function HomepageManager() {
  const [content, setContent] = useState<HomepageContent>(mockHomepageContent);
  const [savedAt, setSavedAt] = useState('Unsaved changes');

  const handleReset = () => {
    setContent(mockHomepageContent);
    setSavedAt('Changes reset');
  };

  const handleSave = () => {
    setSavedAt(`Saved just now`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Homepage editor"
        title="Homepage Manager"
        description="Update the hero, marquee, product callouts, and CTA areas without touching the public layout."
        actions={
          <>
            <p className="hidden text-sm text-muted-foreground sm:block">{savedAt}</p>
            <Button variant="outline" className="rounded-full" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle>Hero content</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Hero title</label>
                  <Input
                    value={content.heroTitle}
                    onChange={(event) => setContent({ ...content, heroTitle: event.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Hero subtitle</label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={(event) => setContent({ ...content, heroSubtitle: event.target.value })}
                    className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">CTA button text</label>
                  <Input
                    value={content.ctaButtonText}
                    onChange={(event) => setContent({ ...content, ctaButtonText: event.target.value })}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Homepage image note</label>
                  <Input value="Hero background image placeholder" readOnly className={inputClassName} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-dashed border-border/80 bg-mwezi-cream p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Hero background image</p>
                      <p className="mt-1 text-xs text-muted-foreground">{content.heroBackgroundImage}</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <ImageUp className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>
                <div className="rounded-3xl border border-dashed border-border/80 bg-mwezi-cream p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Product image</p>
                      <p className="mt-1 text-xs text-muted-foreground">{content.productImage}</p>
                    </div>
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
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Marquee words</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  setContent({
                    ...content,
                    marqueeWords: [...content.marqueeWords, 'New marquee word'],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add word
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {content.marqueeWords.map((word, index) => (
                <div key={word} className="rounded-2xl border border-border/70 bg-white p-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Word {index + 1}</label>
                  <Input
                    value={word}
                    onChange={(event) => {
                      const next = [...content.marqueeWords];
                      next[index] = event.target.value;
                      setContent({ ...content, marqueeWords: next });
                    }}
                    className={cn(inputClassName, 'mt-2')}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Feature blocks</CardTitle>
              <Sparkles className="h-5 w-5 text-mwezi-primary" />
            </CardHeader>
            <CardContent className="grid gap-4">
              {content.featureBlocks.map((block) => (
                <div key={block.id} className="rounded-3xl border border-border/70 bg-mwezi-cream p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                    <Input
                      value={block.title}
                      onChange={(event) => {
                        const next = content.featureBlocks.map((item) => (item.id === block.id ? { ...item, title: event.target.value } : item));
                        setContent({ ...content, featureBlocks: next });
                      }}
                      className={inputClassName}
                    />
                    <Input
                      value={block.description}
                      onChange={(event) => {
                        const next = content.featureBlocks.map((item) =>
                          item.id === block.id ? { ...item, description: event.target.value } : item,
                        );
                        setContent({ ...content, featureBlocks: next });
                      }}
                      className={inputClassName}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>CTA sections</CardTitle>
              <Type className="h-5 w-5 text-mwezi-primary" />
            </CardHeader>
            <CardContent className="grid gap-4">
              {content.ctaSections.map((section) => (
                <div key={section.id} className="grid gap-3 rounded-3xl border border-border/70 bg-white p-4 md:grid-cols-[1fr_1.2fr_0.8fr]">
                  <Input
                    value={section.title}
                    onChange={(event) => {
                      const next = content.ctaSections.map((item) => (item.id === section.id ? { ...item, title: event.target.value } : item));
                      setContent({ ...content, ctaSections: next });
                    }}
                    className={inputClassName}
                  />
                  <Input
                    value={section.description}
                    onChange={(event) => {
                      const next = content.ctaSections.map((item) => (item.id === section.id ? { ...item, description: event.target.value } : item));
                      setContent({ ...content, ctaSections: next });
                    }}
                    className={inputClassName}
                  />
                  <Input
                    value={section.buttonText}
                    onChange={(event) => {
                      const next = content.ctaSections.map((item) => (item.id === section.id ? { ...item, buttonText: event.target.value } : item));
                      setContent({ ...content, ctaSections: next });
                    }}
                    className={inputClassName}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-border/80 shadow-sm">
            <div className="bg-mwezi-hero px-6 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mwezi-deep">Homepage preview</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{content.heroTitle}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{content.heroSubtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {content.marqueeWords.slice(0, 3).map((word) => (
                  <span key={word} className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-mwezi-deep shadow-sm">
                    {word}
                  </span>
                ))}
              </div>
              <Button className="mt-5 rounded-full bg-mwezi-primary hover:bg-mwezi-deep">
                {content.ctaButtonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-mwezi-cream p-4">
                  <p className="text-sm font-medium text-foreground">Hero background</p>
                  <p className="mt-1 text-xs text-muted-foreground">{content.heroBackgroundImage}</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-mwezi-cream p-4">
                  <p className="text-sm font-medium text-foreground">Product image</p>
                  <p className="mt-1 text-xs text-muted-foreground">{content.productImage}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-dashed border-border/70 p-4">
                <p className="text-sm font-medium text-foreground">Feature block preview</p>
                <div className="mt-3 space-y-3">
                  {content.featureBlocks.map((block) => (
                    <div key={block.id} className="rounded-2xl bg-secondary/50 p-4">
                      <p className="font-medium text-foreground">{block.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
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
