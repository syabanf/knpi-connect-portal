import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Megaphone, Plus, Edit, Trash2, Search, Users } from "lucide-react";
import AudiencePicker from "@/components/shared/AudiencePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "general", priority: "medium", is_pinned: false, published: true, target_audience: "all", target_branches: [], target_positions: [], target_emails: [] });

  useEffect(() => { loadItems(); }, []);

  const loadItems = () => {
    base44.entities.Announcement.list('-created_date', 200).then(setItems).catch(() => []).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error("Title and content required"); return; }
    try {
      if (editingItem) {
        await base44.entities.Announcement.update(editingItem.id, form);
        toast.success("Announcement updated!");
      } else {
        await base44.entities.Announcement.create(form);
        toast.success("Announcement created!");
      }
      resetDialog();
      loadItems();
    } catch { toast.error("Failed to save."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await base44.entities.Announcement.delete(id);
      setItems(prev => prev.filter(a => a.id !== id));
      toast.success("Deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setForm({ title: "", content: "", category: "general", priority: "medium", is_pinned: false, published: true, target_audience: "all", target_branches: [], target_positions: [], target_emails: [] });
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(item);
    setDialogOpen(true);
  };

  const filtered = items.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Manage Announcements" description={`${items.length} announcements`}>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold"><Plus className="w-4 h-4 mr-2" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingItem ? "Edit Announcement" : "New Announcement"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Content *</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AudiencePicker
                mode="announcement"
                value={form}
                onChange={patch => setForm(prev => ({ ...prev, ...patch }))}
              />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_pinned} onCheckedChange={v => setForm({ ...form, is_pinned: v })} /><Label>Pinned</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setForm({ ...form, published: v })} /><Label>Published</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full font-semibold">{editingItem ? "Update" : "Publish"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                   <div className="flex items-center gap-2">
                     <span className="font-medium">{a.title}</span>
                     {a.is_pinned && <span className="text-[10px] bg-knpi-maroon text-white px-1.5 py-0.5 rounded-full font-bold">PIN</span>}
                     {a.target_audience && a.target_audience !== "all" && (
                       <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{a.target_audience}</span>
                     )}
                   </div>
                  </TableCell>
                  <TableCell><StatusBadge status={a.category} /></TableCell>
                  <TableCell className="hidden sm:table-cell"><StatusBadge status={a.priority} /></TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`text-xs font-medium ${a.published ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={Megaphone} title="No announcements" description="Create your first announcement." />
      )}
    </div>
  );
}