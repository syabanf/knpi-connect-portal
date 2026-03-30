import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Layout, Plus, Edit, Eye, EyeOff, Save, X, Image, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "sonner";

const SECTION_LABELS = {
  hero: "🏠 Hero Section",
  about: "ℹ️ About Section",
  program: "🎯 Programs Section",
  cta: "📣 Call-to-Action Section",
  footer: "🔗 Footer",
};

const SECTION_HINTS = {
  hero: "Main banner at the top of the landing page",
  about: "Organization background and mission/vision",
  program: "Core programs displayed as cards",
  cta: "Call-to-action banner encouraging sign-up",
  footer: "Footer contact and links area",
};

export default function AdminCMS() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setForm({ key: "", title: "", content: "", image_url: "", type: "hero", is_active: true, order: 0 });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.key || !form.title) { toast.error("Key and title are required"); return; }
    setSaving(true);
    try {
      if (editBlock) {
        await base44.entities.ContentBlock.update(editBlock.id, form);
        toast.success("Content block updated!");
      } else {
        await base44.entities.ContentBlock.create(form);
        toast.success("Content block created!");
      }
      setDialogOpen(false);
      loadBlocks();
    } catch { toast.error("Failed to save."); }
    setSaving(false);
  };

  const toggleActive = async (block) => {
    try {
      await base44.entities.ContentBlock.update(block.id, { is_active: !block.is_active });
      setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, is_active: !b.is_active } : b));
      toast.success(block.is_active ? "Block hidden" : "Block visible");
    } catch { toast.error("Failed to update."); }
  };

  // Group by type
  const grouped = Object.keys(SECTION_LABELS).reduce((acc, type) => {
    acc[type] = blocks.filter(b => b.type === type);
    return acc;
  }, {});

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="CMS — Web Pages" description="Customize the public landing page content">
        <Button onClick={openNew} className="font-semibold"><Plus className="w-4 h-4 mr-2" /> New Block</Button>
      </PageHeader>

      <div className="space-y-8">
        {Object.entries(SECTION_LABELS).map(([type, label]) => (
          <div key={type}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-heading font-bold text-base">{label}</h2>
              <span className="text-xs text-muted-foreground">{SECTION_HINTS[type]}</span>
            </div>
            {grouped[type].length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                No content blocks for this section yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[type].map(block => (
                  <div key={block.id} className={`bg-card rounded-xl border p-4 flex flex-col gap-3 ${!block.is_active ? 'opacity-50' : ''}`}>
                    {block.image_url && (
                      <img src={block.image_url} alt={block.title} className="w-full h-32 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-heading font-semibold text-sm">{block.title}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{block.key}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${block.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {block.is_active ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                      {block.content && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{block.content}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                      <button onClick={() => toggleActive(block)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        {block.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {block.is_active ? 'Hide' : 'Show'}
                      </button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(block)}>
                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditBlock(null); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editBlock ? "Edit Content Block" : "New Content Block"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Key (unique identifier) *</Label>
                <Input value={form.key || ""} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="e.g. hero_title" />
              </div>
              <div>
                <Label>Section Type</Label>
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
              <Input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Display title or heading" />
            </div>
            <div>
              <Label>Content / Description</Label>
              <Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Body text, description, or rich content..." />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image_url || ""} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Visible on site</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Switch checked={!!form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  <span className="text-sm text-muted-foreground">{form.is_active ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full font-semibold">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}