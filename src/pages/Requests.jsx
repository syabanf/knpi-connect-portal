import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ClipboardList, Plus, Send, Eye, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function Requests() {
  const { user } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "certificate", priority: "medium" });

  useEffect(() => {
    base44.entities.ServiceRequest.list('-created_date', 50)
      .then(setRequests).catch(() => []).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Please enter a title"); return; }
    setSubmitting(true);
    try {
      const created = await base44.entities.ServiceRequest.create({
        ...form,
        requester_name: user?.full_name || "Member",
        requester_email: user?.email || "",
        status: "submitted",
      });
      setRequests(prev => [created, ...prev]);
      setForm({ title: "", description: "", type: "certificate", priority: "medium" });
      setDialogOpen(false);
      toast.success("Request submitted successfully!");
    } catch {
      toast.error("Failed to submit request.");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Service Requests" description="Submit and track your service requests">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold"><Plus className="w-4 h-4 mr-2" /> New Request</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Submit a Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief title for your request" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="membership_change">Membership Change</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your request in detail..." rows={4} />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full font-semibold">
                <Send className="w-4 h-4 mr-2" /> {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {detailRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailRequest(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-heading font-bold text-lg">{detailRequest.title}</h2>
              <button onClick={() => setDetailRequest(null)} className="p-1 hover:bg-muted rounded-lg"><XIcon className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={detailRequest.status} />
              <StatusBadge status={detailRequest.type} />
              <StatusBadge status={detailRequest.priority} />
            </div>
            {detailRequest.description && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</p>
                <p className="text-sm whitespace-pre-wrap">{detailRequest.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><p className="text-xs uppercase text-muted-foreground font-semibold">Submitted by</p><p>{detailRequest.requester_name}</p></div>
              <div><p className="text-xs uppercase text-muted-foreground font-semibold">Date</p><p>{new Date(detailRequest.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
              {detailRequest.requester_email && <div className="col-span-2"><p className="text-xs uppercase text-muted-foreground font-semibold">Email</p><p>{detailRequest.requester_email}</p></div>}
            </div>
            {detailRequest.admin_notes && (
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Admin Response</p>
                <p className="text-sm">{detailRequest.admin_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-all cursor-pointer" onClick={() => setDetailRequest(r)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <StatusBadge status={r.status} />
                    <StatusBadge status={r.type} />
                    <StatusBadge status={r.priority} />
                  </div>
                  <h3 className="font-heading font-semibold">{r.title}</h3>
                  {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted {new Date(r.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {r.requester_name && ` by ${r.requester_name}`}
                  </p>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ClipboardList} title="No requests yet" description="Submit your first service request using the button above." />
      )}
    </div>
  );
}