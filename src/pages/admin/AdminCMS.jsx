import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit, Eye, EyeOff, Save, Trash2, Image, FileText, Megaphone, Home, Info, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const SECTIONS = [
  { key: "all", label: "All Blocks", icon: Layout },
  { key: "hero", label: "Hero", icon: Home },
  { key: "about", label: "About", icon: Info },
  { key: "program", label: "Programs", icon: FileText },
  { key: "cta", label: "Call-to-Action", icon: Megaphone },
  { key: "footer", label: "Footer", icon: Layout },
];

export default function AdminCMS() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [editBlock, setEditBlock] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { loadBlocks(); }, []);

  const loadBlocks = () => {
    base44.entities.ContentBlock.list('order', 100)
      .then(setBlocks).catch(() => []).finally(() => setLoading(false));
  };

  const openEdit = (block) => {
    setEditBlock(block);
    setForm({ ...block });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditBlock(null);
    setForm({ key: "", title: "", content: "", image_url: "", type: activeTab === "all" ? "hero" : activeTab, is_active: true, order: 0 });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.key || !form.title) { toast.error("Key and title are required"); return; }
    setSaving(true);
    try {
      if (editBlock) {
        await base44.entities.ContentBlock.update(editBlock.id, form);
        toast.success("Block updated!");
      } else {
        await base44.entities.ContentBlock.create(form);
        toast.success("Block created!");
      }
      setDialogOpen(false);
      loadBlocks();
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this block?")) return;
    try {
      await base44.entities.ContentBlock.delete(id);
      setBlocks(prev => prev.filter(b => b.id !== id));
      toast.success("Block deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const toggleActive = async (block) => {
    try {
      await base44.entities.ContentBlock.update(block.id, { is_active: !block.is_active });
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, is_active: !b.is_active } : b));
      toast.success(block.is_active ? "Hidden" : "Now visible");
    } catch { toast.error("Failed to update."); }
  };

  const filtered = activeTab === "all" ? blocks : blocks.filter(b => b.type === activeTab);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Web Page Content</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage content blocks shown on the public landing page</p>
        </div>
        <Button onClick={openNew} className="font-semibold">
          <Plus className="w-4 h-4 mr-2" /> New Block
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit flex-wrap">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const count = s.key === "all" ? blocks.length : blocks.filter(b => b.type === s.key).length;
          return (
            <button
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === s.key ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === s.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl">
          <Layout className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-muted-foreground">No content blocks yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "New Block" to add content to this section</p>
          <Button onClick={openNew} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" /> Add Block
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(block => (
            <div
              key={block.id}
              className={`bg-card rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-md ${!block.is_active ? "opacity-60" : ""}`}
            >
              {block.image_url ? (
                <div className="relative h-36 overflow-hidden">
                  <img src={block.image_url} alt={block.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${block.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                      {block.is_active ? "● Live" : "● Hidden"}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3">
                    <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full capitalize">{block.type}</span>
                  </div>
                </div>
              ) : (
                <div className="h-16 bg-gradient-to-br from-primary/5 to-secondary flex items-center justify-between px-4">
                  <span className="text-xs font-semibold text-primary capitalize bg-primary/10 px-2 py-1 rounded-full">{block.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${block.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {block.is_active ? "● Live" : "● Hidden"}
                  </span>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col gap-2">
                <div>
                  <p className="font-heading font-semibold text-sm leading-snug">{block.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{block.key}</p>
                </div>
                {block.content && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{block.content}</p>
                )}
              </div>

              <div className="px-4 pb-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleActive(block)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {block.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {block.is_active ? "Hide" : "Show"}
                </button>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(block.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={() => openEdit(block)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditBlock(null); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editBlock ? "Edit Content Block" : "New Content Block"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Unique Key *</Label>
                <Input value={form.key || ""} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="e.g. hero_title" className="font-mono text-sm" />
              </div>
              <div>
                <Label>Section</Label>
                <Select value={form.type || "hero"} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="cta">Call-to-Action</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Title *</Label>
              <Input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Heading or display title" />
            </div>
            <div>
              <Label>Content / Description</Label>
              <Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Body text or description..." />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image_url || ""} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg border" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Visibility</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={!!form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  <span className="text-sm">{form.is_active ? "Visible on site" : "Hidden"}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full font-semibold">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : editBlock ? "Update Block" : "Create Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}