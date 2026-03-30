import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Settings, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function AdminSettings() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [form, setForm] = useState({ key: "", title: "", content: "", type: "hero", is_active: true, order: 0 });

  useEffect(() => { loadBlocks(); }, []);

  const loadBlocks = () => {
    base44.entities.ContentBlock.list('order', 100).then(setBlocks).catch(() => []).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    if (!form.key || !form.title) { toast.error("Key and title required"); return; }
    try {
      if (editingBlock) {
        await base44.entities.ContentBlock.update(editingBlock.id, form);
        toast.success("Block updated!");
      } else {
        await base44.entities.ContentBlock.create(form);
        toast.success("Block created!");
      }
      resetDialog();
      loadBlocks();
    } catch { toast.error("Failed to save."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this content block?")) return;
    try {
      await base44.entities.ContentBlock.delete(id);
      setBlocks(prev => prev.filter(b => b.id !== id));
      toast.success("Deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingBlock(null);
    setForm({ key: "", title: "", content: "", type: "hero", is_active: true, order: 0 });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Content Settings" description="Manage content blocks and portal settings">
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold"><Plus className="w-4 h-4 mr-2" /> Add Block</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">{editingBlock ? "Edit Block" : "New Content Block"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Key *</Label><Input value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="e.g. hero_banner" /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="program">Program</SelectItem>
                      <SelectItem value="cta">CTA</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Content</Label><Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url || ""} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Order</Label><Input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div>
                <div className="flex items-center gap-2 pt-5"><Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
              </div>
              <Button onClick={handleSave} className="w-full font-semibold"><Save className="w-4 h-4 mr-2" /> Save Block</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {blocks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map(b => (
            <div key={b.id} className={`bg-card rounded-xl border border-border p-5 ${!b.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-secondary px-2 py-0.5 rounded-full">{b.type}</span>
                  <h3 className="font-heading font-semibold mt-2">{b.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Key: {b.key}</p>
                  {b.content && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{b.content}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingBlock(b); setForm(b); setDialogOpen(true); }}>
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Settings} title="No content blocks" description="Create content blocks to customize your portal." />
      )}
    </div>
  );
}