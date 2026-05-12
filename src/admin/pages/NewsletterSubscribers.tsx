import { Download, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { mockSubscribers } from '../data/mockAdminData';
import type { Subscriber } from '../types/admin';

export default function NewsletterSubscribers() {
  const [search, setSearch] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);

  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((subscriber) => {
        const haystack = `${subscriber.name} ${subscriber.email}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [search, subscribers],
  );

  const handleExport = () => {
    const csv = ['Name,Email,Subscription Date,Status', ...filteredSubscribers.map((item) => `${item.name},${item.email},${item.subscriptionDate},${item.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mwezi-subscribers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Newsletter"
        title="Subscribers"
        description="Keep the mailing list organized, active, and ready for campaigns or updates."
        actions={
          <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subscribers..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-border/70">
            <thead className="bg-mwezi-cream/70 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Subscription date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-white">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-5 font-medium text-foreground">{subscriber.name}</td>
                  <td className="px-6 py-5 text-sm text-foreground">{subscriber.email}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{subscriber.subscriptionDate}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={subscriber.status} />
                  </td>
                  <td className="px-6 py-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-rose-700 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setDeleteTarget(subscriber)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={5}>
                    No subscribers match the current search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete subscriber?"
        description="This removes the subscriber from the list. In production this should be a reversible admin action."
        confirmLabel="Delete subscriber"
        onConfirm={() => deleteTarget && setSubscribers((current) => current.filter((item) => item.id !== deleteTarget.id))}
      />
    </div>
  );
}
