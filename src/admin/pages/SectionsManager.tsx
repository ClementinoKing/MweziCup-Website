import { GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { mockWebsiteSections } from '../data/mockAdminData';
import type { WebsiteSection } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15';

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
  const selectedSection = useMemo(() => sections.find((section) => section.id === selectedId) ?? sections[0], [sections, selectedId]);

  const updateSection = (next: WebsiteSection) => {
    setSections((current) => current.map((section) => (section.id === next.id ? next : section)));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content architecture"
        title="Sections Manager"
        description="Manage homepage and product sections, including visibility, ordering, copy, imagery, and FAQ content."
        actions={
          <Button
            className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep"
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
            }}
          >
            <Plus className="h-4 w-4" />
            Add section
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>Section list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`rounded-3xl border p-4 transition ${section.id === selectedId ? 'border-mwezi-soft bg-mwezi-cream shadow-sm' : 'border-border/70 bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className="mt-1 rounded-xl border border-border bg-white p-2 text-muted-foreground"
                    aria-label="Drag handle"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{section.title}</p>
                        <p className="text-sm text-muted-foreground">Order {section.order}</p>
                      </div>
                      <StatusBadge status={section.visibility} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{section.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSelectedId(section.id)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full text-rose-700 hover:bg-rose-50 hover:text-rose-700" onClick={() => setDeleteTarget(section)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Section editor</CardTitle>
              <p className="text-sm text-muted-foreground">Update content, images, and visibility for the selected section.</p>
            </div>
            <StatusBadge status={selectedSection?.visibility ?? 'Visible'} />
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Section title</label>
                <Input
                  value={selectedSection?.title ?? ''}
                  onChange={(event) => selectedSection && updateSection({ ...selectedSection, title: event.target.value })}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Section order</label>
                <Input
                  type="number"
                  value={selectedSection?.order ?? 0}
                  onChange={(event) =>
                    selectedSection && updateSection({ ...selectedSection, order: Number(event.target.value) || 0 })
                  }
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={selectedSection?.description ?? ''}
                onChange={(event) => selectedSection && updateSection({ ...selectedSection, description: event.target.value })}
                className="min-h-[110px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product name</label>
                <Input
                  value={selectedSection?.productName ?? ''}
                  onChange={(event) => selectedSection && updateSection({ ...selectedSection, productName: event.target.value })}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Visibility</label>
                <button
                  type="button"
                  className={`flex h-11 w-full items-center justify-between rounded-2xl border px-4 text-sm font-medium transition ${
                    selectedSection?.visibility === 'Visible'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                  onClick={() =>
                    selectedSection &&
                    updateSection({
                      ...selectedSection,
                      visibility: selectedSection.visibility === 'Visible' ? 'Hidden' : 'Visible',
                    })
                  }
                >
                  {selectedSection?.visibility ?? 'Visible'}
                  <span className="text-xs text-muted-foreground">Toggle</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product description</label>
              <textarea
                value={selectedSection?.productDescription ?? ''}
                onChange={(event) => selectedSection && updateSection({ ...selectedSection, productDescription: event.target.value })}
                className="min-h-[90px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Benefits</label>
                <textarea
                  value={toList(selectedSection?.benefits ?? [])}
                  onChange={(event) =>
                    selectedSection && updateSection({ ...selectedSection, benefits: fromList(event.target.value) })
                  }
                  className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Usage instructions</label>
                <textarea
                  value={toList(selectedSection?.usageInstructions ?? [])}
                  onChange={(event) =>
                    selectedSection && updateSection({ ...selectedSection, usageInstructions: fromList(event.target.value) })
                  }
                  className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Feature highlights</label>
                <textarea
                  value={toList(selectedSection?.featureHighlights ?? [])}
                  onChange={(event) =>
                    selectedSection && updateSection({ ...selectedSection, featureHighlights: fromList(event.target.value) })
                  }
                  className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">FAQ items</label>
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
                  className="min-h-[140px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product images</label>
                <textarea
                  value={toList(selectedSection?.productImages ?? [])}
                  onChange={(event) =>
                    selectedSection && updateSection({ ...selectedSection, productImages: fromList(event.target.value) })
                  }
                  className="min-h-[140px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep">
                <Save className="h-4 w-4" />
                Save section
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
