import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Plus, Edit, Trash2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", type: "seminar", status: "upcoming", capacity: "", is_featured: false });

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = () => {
    base44.entities.Event.list('-date', 200).then(setEvents).catch(() => []).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    if (!form.title || !form.date) { toast.error("Title and date are required"); return; }
    try {
      const data = { ...form, capacity: form.capacity ? Number(form.capacity) : undefined };
      if (editingEvent) {
        await base44.entities.Event.update(editingEvent.id, data);
        toast.success("Event updated!");
      } else {
        await base44.entities.Event.create(data);
        toast.success("Event created!");
      }
      resetDialog();
      loadEvents();
    } catch { toast.error("Failed to save event."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await base44.entities.Event.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    setForm({ title: "", description: "", date: "", location: "", type: "seminar", status: "upcoming", capacity: "", is_featured: false });
  };

  const openEdit = (evt) => {
    setEditingEvent(evt);
    setForm({ ...evt, capacity: evt.capacity?.toString() || "", date: evt.date ? new Date(evt.date).toISOString().slice(0, 16) : "" });
    setDialogOpen(true);
  };

  const filtered = events.filter(e => e.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Manage Events" description={`${events.length} events`}>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="font-semibold"><Plus className="w-4 h-4 mr-2" /> Create Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Date & Time *</Label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="Leave empty for unlimited" /></div>
              <div><Label>Description</Label><Textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_featured} onCheckedChange={v => setForm({ ...form, is_featured: v })} />
                <Label>Featured Event</Label>
              </div>
              <Button onClick={handleSave} className="w-full font-semibold">{editingEvent ? "Update Event" : "Create Event"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search events..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Registrations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{e.title}</span>
                      {e.is_featured && <span className="ml-2 text-[10px] bg-knpi-yellow text-knpi-dark px-1.5 py-0.5 rounded-full font-bold">FEATURED</span>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {e.date && new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {e.registered_count || 0}{e.capacity ? `/${e.capacity}` : ''}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(e)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={Calendar} title="No events" description="Create your first event." />
      )}
    </div>
  );
}