import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ClipboardList, Search, MessageSquare, LayoutGrid, List } from "lucide-react";
import RequestsKanban from "@/components/requests/RequestsKanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReq, setSelectedReq] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [viewMode, setViewMode] = useState("kanban");

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = () => {
    base44.entities.ServiceRequest.list('-created_date', 500).then(setRequests).catch(() => []).finally(() => setLoading(false));
  };

  const handleUpdate = async () => {
    try {
      const data = { status: newStatus, admin_notes: adminNotes };
      if (newStatus === 'completed' || newStatus === 'rejected') {
        data.resolved_date = new Date().toISOString();
      }
      await base44.entities.ServiceRequest.update(selectedReq.id, data);
      toast.success("Request updated!");
      setSelectedReq(null);
      loadRequests();
    } catch { toast.error("Failed to update."); }
  };

  const openReview = (req) => {
    setSelectedReq(req);
    setAdminNotes(req.admin_notes || "");
    setNewStatus(req.status);
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.title?.toLowerCase().includes(search.toLowerCase()) || r.requester_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Manage Requests" description={`${requests.length} total requests`}>
        <div className="flex gap-1 border rounded-lg p-0.5">
          <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-primary text-white' : 'hover:bg-muted'}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'}`}><List className="w-4 h-4" /></button>
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'kanban' ? (
        <RequestsKanban requests={filtered} onUpdate={loadRequests} adminMode={true} />
      ) : filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Requester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.requester_name}</TableCell>
                  <TableCell><StatusBadge status={r.type} /></TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="hidden md:table-cell"><StatusBadge status={r.priority} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openReview(r)}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={ClipboardList} title="No requests" description="No service requests to review." />
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedReq} onOpenChange={(open) => { if (!open) setSelectedReq(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Review Request</DialogTitle>
          </DialogHeader>
          {selectedReq && (
            <div className="space-y-4 mt-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold">{selectedReq.title}</h3>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={selectedReq.type} />
                  <StatusBadge status={selectedReq.priority} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{selectedReq.description || "No description"}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  By {selectedReq.requester_name} ({selectedReq.requester_email}) •{" "}
                  {new Date(selectedReq.created_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} placeholder="Add a response or notes..." />
              </div>
              <Button onClick={handleUpdate} className="w-full font-semibold">Update Request</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}