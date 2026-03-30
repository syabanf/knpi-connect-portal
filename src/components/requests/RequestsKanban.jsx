import { useState } from "react";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { Eye, X as XIcon, Paperclip } from "lucide-react";

const COLUMNS = [
  { key: "submitted", label: "Submitted", color: "bg-blue-50 border-blue-200" },
  { key: "in_review", label: "In Review", color: "bg-yellow-50 border-yellow-200" },
  { key: "approved", label: "Approved", color: "bg-green-50 border-green-200" },
  { key: "rejected", label: "Rejected", color: "bg-red-50 border-red-200" },
  { key: "completed", label: "Completed", color: "bg-gray-50 border-gray-200" },
];

export default function RequestsKanban({ requests, onUpdate, adminMode = false }) {
  const [detail, setDetail] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = requests.filter(r => r.status === col.key);
    return acc;
  }, {});

  const handleDrop = async (newStatus) => {
    if (!dragging || dragging.status === newStatus || !adminMode) return;
    try {
      const data = { status: newStatus };
      if (newStatus === 'completed' || newStatus === 'rejected') {
        data.resolved_date = new Date().toISOString();
      }
      await base44.entities.ServiceRequest.update(dragging.id, data);
      onUpdate();
      toast.success("Status updated!");
    } catch { toast.error("Failed to update."); }
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map(col => (
          <div
            key={col.key}
            className={`w-64 rounded-xl border-2 flex flex-col ${col.color} ${over === col.key ? 'ring-2 ring-primary' : ''}`}
            onDragOver={e => { e.preventDefault(); setOver(col.key); }}
            onDragLeave={() => setOver(null)}
            onDrop={() => handleDrop(col.key)}
          >
            <div className="px-4 py-3 border-b border-inherit flex items-center justify-between">
              <span className="font-heading font-semibold text-sm">{col.label}</span>
              <span className="bg-white/70 text-xs font-bold px-2 py-0.5 rounded-full">{grouped[col.key].length}</span>
            </div>
            <div className="flex-1 p-3 space-y-2 min-h-[200px]">
              {grouped[col.key].map(r => (
                <div
                  key={r.id}
                  draggable={adminMode}
                  onDragStart={() => setDragging(r)}
                  onDragEnd={() => { setDragging(null); setOver(null); }}
                  className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setDetail(r)}
                >
                  <p className="font-semibold text-sm line-clamp-2">{r.title}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <StatusBadge status={r.type} />
                    <StatusBadge status={r.priority} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{r.requester_name}</p>
                  {r.attachments?.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Paperclip className="w-3 h-3" /> {r.attachments.length} file(s)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-heading font-bold text-lg">{detail.title}</h2>
              <button onClick={() => setDetail(null)} className="p-1 hover:bg-muted rounded-lg"><XIcon className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={detail.status} />
              <StatusBadge status={detail.type} />
              <StatusBadge status={detail.priority} />
            </div>
            {detail.description && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</p>
                <p className="text-sm whitespace-pre-wrap">{detail.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><p className="text-xs uppercase text-muted-foreground font-semibold">Submitted by</p><p>{detail.requester_name}</p></div>
              <div><p className="text-xs uppercase text-muted-foreground font-semibold">Date</p><p>{new Date(detail.created_date).toLocaleDateString()}</p></div>
              {detail.requester_email && <div className="col-span-2"><p className="text-xs uppercase text-muted-foreground font-semibold">Email</p><p>{detail.requester_email}</p></div>}
            </div>
            {detail.attachments?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Attachments</p>
                <div className="space-y-1">
                  {detail.attachments.map((a, i) => (
                    <a key={i} href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Paperclip className="w-3.5 h-3.5" /> {a.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {detail.admin_notes && (
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Admin Response</p>
                <p className="text-sm">{detail.admin_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}