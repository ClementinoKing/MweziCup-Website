import { 
  GripVertical, 
  Plus, 
  Save, 
  Trash2, 
  List,
  Edit3,
  Eye,
  EyeOff,
  Package,
  Image as ImageIcon,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Hash,
  FileText,
  Sparkles
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { mockWebsiteSections } from '../data/mockAdminData';
import type { WebsiteSection } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15 transition-all';

function toList(value: string[]) {
  return value.join('\n');
}

function fromList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SectionsManager() {
  const [sections, setSections] = useState<WebsiteSection[]>(mockWebsiteSections);
  const [selectedId, setSelectedId] = useState(mockWebsiteSections[0]?.id ?? '');
  const [deleteTarget, setDeleteTarget] = useState<WebsiteSection | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const selectedSection = useMemo(() => sections.find((section) => section.id === selectedId) ?? sections[0], [sections, selectedId]);

  const updateSection = (next: WebsiteSection) => {
    setSections((current) => current.map((section) => (section.id === next.id ? next : section)));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
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
        eyebrow="Content architecture"
        title="Sections Manager"
        description="Manage homepage and product sections, including visibility, ordering, copy, imagery, and FAQ content."
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
              className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep shadow-md hover:shadow-lg transition-all"
              onClick={() => {
                const nextSection: WebsiteSection = {
                  id: `section-${Date.now()}`,
                  title: 'New section',
                  description: 'Describe the purpose of this section.',
                  order: sections.length + 1,
                  visibility: 'Hidden',
                  type: 'Product',
                  productName: 'Mwezi Cup',
                  productDescription: '',
                  benefits: [],
                  usageInstructions: [],
                  featureHighlights: [],
                  faqItems: [],
                  productImages: [],
                };
                setSections((current) => [...current, nextSection]);
                setSelectedId(nextSection.id);
                setHasChanges(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add section
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Section List */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <List className="h-5 w-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <CardTitle>Section list</CardTitle>
                <CardDescription>All sections in display order</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`group rounded-3xl border-2 p-5 transition-all ${
                  section.id === selectedId 
                    ? 'border-mwezi-primary/40 bg-gradient-to-br from-mwezi-cream/50 to-mwezi-cream/30 dark:from-mwezi-primary/10 dark:to-mwezi-primary/5 shadow-md' 
                    : 'border-border/70 bg-card hover:border-border hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-1 rounded-xl border-2 border-border/60 bg-background p-2 text-muted-foreground hover:border-mwezi-primary/40 hover:bg-mwezi-cream/30 dark:hover:bg-mwezi-primary/10 transition-all"
                    aria-label="Drag handle"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground truncate">{section.title}</p>
                          {section.id === selectedId && (
                            <span className="flex items-center gap-1 text-xs font-medium text-mwezi-primary">
                              <Edit3 className="h-3 w-3" />
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <span>Order {section.order}</span>
                        </div>
                      </div>
                      <StatusBadge status={section.visibility} />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{section.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button 
                        variant={section.id === selectedId ? "default" : "outline"}
                        size="sm" 
                        className="rounded-full shadow-sm hover:shadow-md transition-all" 
                        onClick={() => setSelectedId(section.id)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        {section.id === selectedId ? 'Editing' : 'Edit'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all" 
                        onClick={() => setDeleteTarget(section)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section Editor */}
        <Card className="border-border/80 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <Edit3 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <CardTitle>Section editor</CardTitle>
                  <CardDescription>Update content, images, and visibility for the selected section.</CardDescription>
                </div>
              </div>
              <StatusBadge status={selectedSection?.visibility ?? 'Visible'} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            {/* Basic Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Basic Information
              </div>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Section title
                  </label>
                  <Input
                    value={selectedSection?.title ?? ''}
                    onChange={(event) => selectedSection && updateSection({ ...selectedSection, title: event.target.value })}
                    className={inputClassName}
                    placeholder="Hero section"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Section order
                  </label>
                  <Input
                    type="number"
                    value={selectedSection?.order ?? 0}
                    onChange={(event) =>
                      selectedSection && updateSection({ ...selectedSection, order: Number(event.target.value) || 0 })
                    }
                    className={inputClassName}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description
                </label>
                <textarea
                  value={selectedSection?.description ?? ''}
                  onChange={(event) => selectedSection && updateSection({ ...selectedSection, description: event.target.value })}
                  className="min-h-[110px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                  placeholder="Brand headline, supporting copy, and the call-to-action..."
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-5 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Package className="h-4 w-4 text-muted-foreground" />
                Product Details
              </div>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Product name
                  </label>
                  <Input
                    value={selectedSection?.productName ?? ''}
                    onChange={(event) => selectedSection && updateSection({ ...selectedSection, productName: event.target.value })}
                    className={inputClassName}
                    placeholder="Mwezi Cup"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    {selectedSection?.visibility === 'Visible' ? (
                      <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-rose-600 dark:text-rose-500" />
                    )}
                    Visibility
                  </label>
                  <button
                    type="button"
                    className={`flex h-11 w-full items-center justify-between rounded-2xl border-2 px-4 text-sm font-semibold transition-all ${
                      selectedSection?.visibility === 'Visible'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50'
                        : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50'
                    }`}
                    onClick={() =>
                      selectedSection &&
                      updateSection({
                        ...selectedSection,
                        visibility: selectedSection.visibility === 'Visible' ? 'Hidden' : 'Visible',
                      })
                    }
                  >
                    <span className="flex items-center gap-2">
                      {selectedSection?.visibility === 'Visible' ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {selectedSection?.visibility ?? 'Visible'}
                    </span>
                    <span className="text-xs opacity-70">Click to toggle</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Product description
                </label>
                <textarea
                  value={selectedSection?.productDescription ?? ''}
                  onChange={(event) => selectedSection && updateSection({ ...selectedSection, productDescription: event.target.value })}
                  className="min-h-[90px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                  placeholder="Reusable menstrual care designed for comfort..."
                />
              </div>
            </div>

            {/* Content Lists */}
            <div className="space-y-5 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <List className="h-4 w-4 text-muted-foreground" />
                Content Lists
              </div>
              
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Benefits</label>
                  <textarea
                    value={toList(selectedSection?.benefits ?? [])}
                    onChange={(event) =>
                      selectedSection && updateSection({ ...selectedSection, benefits: fromList(event.target.value) })
                    }
                    className="min-h-[120px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="Body-safe&#10;Reusable&#10;Comfort-first"
                  />
                  <p className="text-xs text-muted-foreground">One per line</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Usage instructions</label>
                  <textarea
                    value={toList(selectedSection?.usageInstructions ?? [])}
                    onChange={(event) =>
                      selectedSection && updateSection({ ...selectedSection, usageInstructions: fromList(event.target.value) })
                    }
                    className="min-h-[120px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="Fold gently&#10;Insert carefully&#10;Rinse and sterilize"
                  />
                  <p className="text-xs text-muted-foreground">One per line</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Feature highlights</label>
                  <textarea
                    value={toList(selectedSection?.featureHighlights ?? [])}
                    onChange={(event) =>
                      selectedSection && updateSection({ ...selectedSection, featureHighlights: fromList(event.target.value) })
                    }
                    className="min-h-[120px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="Premium fit&#10;All-day comfort&#10;Low-waste solution"
                  />
                  <p className="text-xs text-muted-foreground">One per line</p>
                </div>
              </div>
            </div>

            {/* FAQ & Images */}
            <div className="space-y-5 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                FAQ & Media
              </div>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    FAQ items
                  </label>
                  <textarea
                    value={selectedSection?.faqItems.map((item) => `${item.question} | ${item.answer}`).join('\n') ?? ''}
                    onChange={(event) =>
                      selectedSection &&
                      updateSection({
                        ...selectedSection,
                        faqItems: event.target.value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [question, answer] = line.split('|').map((item) => item.trim());
                            return { question, answer: answer ?? '' };
                          }),
                      })
                    }
                    className="min-h-[140px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="Is it Durable-friendly? | Yes, the section should reassume first-level users."
                  />
                  <p className="text-xs text-muted-foreground">Format: Question | Answer (one per line)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Product images
                  </label>
                  <textarea
                    value={toList(selectedSection?.productImages ?? [])}
                    onChange={(event) =>
                      selectedSection && updateSection({ ...selectedSection, productImages: fromList(event.target.value) })
                    }
                    className="min-h-[140px] w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                    placeholder="/img/hero.png&#10;/img/product.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Image paths, one per line</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep shadow-md hover:shadow-lg transition-all"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete section?"
        description="The section will be removed from the admin list. In production this would be a soft delete so it can be restored later."
        confirmLabel="Delete section"
        onConfirm={() => deleteTarget && setSections((current) => current.filter((section) => section.id !== deleteTarget.id))}
      />
    </div>
  );
}
