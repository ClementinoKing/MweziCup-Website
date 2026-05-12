import { Check, Eye, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { mockContactMessages } from '../data/mockAdminData';
import type { ContactMessage } from '../types/admin';

export default function ContactMessages() {
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState<ContactMessage[]>(mockContactMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        const haystack = `${message.name} ${message.email} ${message.phone} ${message.subject} ${message.message}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [messages, search],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inbox"
        title="Contact Messages"
        description="Track incoming inquiries, mark items read, and keep responses organized."
      />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-border/70">
            <thead className="bg-muted/30 dark:bg-muted/20 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date received</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-card dark:bg-card/50">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-medium text-foreground">{message.name}</p>
                      <p className="text-sm text-muted-foreground">{message.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-foreground">{message.email}</td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{message.subject}</p>
                      <p className="max-w-md text-sm text-muted-foreground line-clamp-1">{message.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={message.status} />
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{message.receivedAt}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSelectedMessage(message)}>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() =>
                          setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, status: 'Read' } : item)))
                        }
                      >
                        <Check className="h-4 w-4" />
                        Mark as Read
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300" onClick={() => setDeleteTarget(message)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={6}>
                    No messages match the current search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog.Root open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card dark:bg-card/95 p-6 shadow-2xl focus:outline-none">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Dialog.Title className="text-xl font-semibold text-foreground">{selectedMessage?.subject}</Dialog.Title>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedMessage?.status ?? 'New'} />
                  <span className="text-sm text-muted-foreground">{selectedMessage?.receivedAt}</span>
                </div>
              </div>
              <Dialog.Close asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Close
                </Button>
              </Dialog.Close>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-muted/40 dark:bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-primary/90">Name</p>
                  <p className="mt-2 text-sm text-foreground">{selectedMessage?.name}</p>
                </div>
                <div className="rounded-3xl bg-muted/40 dark:bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-primary/90">Contact</p>
                  <p className="mt-2 text-sm text-foreground">{selectedMessage?.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedMessage?.phone}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-background dark:bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Message</p>
                <p className="mt-3 text-sm leading-7 text-foreground">{selectedMessage?.message}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  selectedMessage &&
                  setMessages((current) => current.map((item) => (item.id === selectedMessage.id ? { ...item, status: 'Read' } : item)))
                }
              >
                Mark as Read
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete message?"
        description="This removes the conversation from the admin inbox. In production this should be a soft delete or archival action."
        confirmLabel="Delete message"
        onConfirm={() => deleteTarget && setMessages((current) => current.filter((item) => item.id !== deleteTarget.id))}
      />
    </div>
  );
}
