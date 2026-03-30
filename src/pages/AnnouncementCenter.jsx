import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Megaphone, Pin, Search, X as XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

export default function AnnouncementCenter() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    base44.entities.Announcement.filter({ published: true }, '-created_date', 100)
      .then(setAnnouncements).catch(() => []).finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const pinned = filtered.filter(a => a.is_pinned);
  const regular = filtered.filter(a => !a.is_pinned);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Announcements" description="Stay updated with the latest news and notices" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search announcements..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pinned.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading font-semibold flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-knpi-maroon" /> Pinned
          </h2>
          <div className="space-y-3">
            {pinned.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
          </div>
        </div>
      )}

      {regular.length > 0 ? (
        <div className="space-y-3">
          {regular.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
        </div>
      ) : pinned.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Check back later for updates." />
      ) : null}
    </div>
  );
}

function AnnouncementCard({ announcement: a }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-2xl w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={a.category} />
                <StatusBadge status={a.priority} />
                {a.is_pinned && <span className="text-[10px] font-bold text-knpi-maroon bg-red-50 px-2 py-0.5 rounded-full uppercase">Pinned</span>}
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded-lg ml-2"><XIcon className="w-4 h-4" /></button>
            </div>
            <h2 className="font-heading font-bold text-xl mb-2">{a.title}</h2>
            <p className="text-xs text-muted-foreground mb-4">{new Date(a.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            {a.image_url && <img src={a.image_url} alt={a.title} className="w-full rounded-xl mb-4 max-h-64 object-cover" />}
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{a.content}</p>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-all cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusBadge status={a.category} />
              <StatusBadge status={a.priority} />
              {a.is_pinned && (
                <span className="text-[10px] font-bold text-knpi-maroon bg-red-50 px-2 py-0.5 rounded-full uppercase">Pinned</span>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(a.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg">{a.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.content}</p>
            <span className="text-primary text-sm font-medium mt-1 inline-block hover:underline">Read more</span>
          </div>
        </div>
      </div>
    </>
  );
}