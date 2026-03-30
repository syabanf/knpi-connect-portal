import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Plus, Edit, Trash2, Search, Upload } from "lucide-react";
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

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "general", file_url: "", access_level: "members", is_pinned: false });

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = () => {
    base44.entities.Document.list('-created_date', 200).then(setDocs).catch(() => []).finally(() => setLoading(false));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({
        ...prev,
        file_url,
        file_type: file.name.split('.').pop().toUpperCase(),
        file_size: (file.size / 1024).toFixed(1) + ' KB',
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      toast.success("File uploaded!");
    } catch { toast.error("Upload failed."); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.file_url) { toast.error("Title and file are required"); return; }
    try {
      if (editingDoc) {
        await base44.entities.Document.update(editingDoc.id, form);
        toast.success("Document updated!");
      } else {
        await base44.entities.Document.create(form);
        toast.success("Document added!");
      }
      resetDialog();
      loadDocs();
    } catch { toast.error("Failed to save."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try {
      await base44.entities.Document.delete(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      toast.success("Document deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingDoc(null);
    setForm({ title: "", description: "", category: "general", file_url: "", access_level: "members", is_pinned: false });
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setForm(doc);
    setDialogOpen(true);
  };

  const filtered = docs.filter(d => d.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Manage Documents" description={`${docs.length} documents`}>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold"><Plus className="w-4 h-4 mr-2" /> Add Document</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingDoc ? "Edit Document" : "Add Document"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Upload File *</Label>
                <div className="mt-1">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : form.file_url ? "File uploaded ✓" : "Click to upload"}</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category || "general"} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="guideline">Guideline</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Access Level</Label>
                  <Select value={form.access_level || "members"} onValueChange={v => setForm({ ...form, access_level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_pinned} onCheckedChange={v => setForm({ ...form, is_pinned: v })} />
                <Label>Pin this document</Label>
              </div>
              <Button onClick={handleSave} className="w-full font-semibold">{editingDoc ? "Update Document" : "Add Document"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Access</TableHead>
                <TableHead className="hidden md:table-cell">Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{d.title}</span>
                      {d.is_pinned && <span className="text-[10px] bg-knpi-maroon text-white px-1.5 py-0.5 rounded-full font-bold">PIN</span>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><StatusBadge status={d.category} /></TableCell>
                  <TableCell className="hidden md:table-cell capitalize text-sm">{d.access_level}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{d.download_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(d)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={FileText} title="No documents" description="Upload your first document." />
      )}
    </div>
  );
}