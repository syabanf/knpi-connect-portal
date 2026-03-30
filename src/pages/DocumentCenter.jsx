import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, Download, Search, Pin, FolderOpen, Eye, X as XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

export default function DocumentCenter() {
  const { user } = useOutletContext() || {};
  const [documents, setDocuments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    base44.entities.Document.list('-created_date', 200).then(setDocuments).catch(() => []).finally(() => setLoading(false));
    if (user?.email) {
      base44.entities.Member.filter({ email: user.email }, '-created_date', 1)
        .then(r => setMember(r[0] || null)).catch(() => null);
    }
  }, [user]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const filtered = documents.filter(d => {
    // RBAC: access level check
    if (d.access_level === 'admin' && !isAdmin) return false;
    if (d.access_level === 'members' && !user) return false;

    // Audience targeting
    if (d.audience === 'branch') {
      const branches = d.audience_branches || [];
      if (branches.length > 0 && !isAdmin && !branches.includes(member?.branch)) return false;
    }
    if (d.audience === 'position') {
      const positions = d.audience_positions || [];
      if (positions.length > 0 && !isAdmin && !positions.includes(member?.position)) return false;
    }

    const matchSearch = d.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || d.category === catFilter;
    return matchSearch && matchCat;
  });

  const pinned = filtered.filter(d => d.is_pinned);
  const regular = filtered.filter(d => !d.is_pinned);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <PageHeader title="Document Center" description="Access and download organizational documents" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="guideline">Guideline</SelectItem>
            <SelectItem value="form">Form</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pinned.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading font-semibold flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-knpi-maroon" /> Pinned Documents
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinned.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
          </div>
        </div>
      )}

      {regular.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regular.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
        </div>
      ) : pinned.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No documents found" description="Try adjusting your search or filters." />
      ) : null}
    </div>
  );
}

function DocumentCard({ doc }) {
  const [preview, setPreview] = useState(false);

  const handleDownload = async () => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
      try {
        await base44.entities.Document.update(doc.id, { download_count: (doc.download_count || 0) + 1 });
      } catch {}
    }
  };

  return (
    <>
      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80" onClick={() => setPreview(false)}>
          <div className="flex items-center justify-between px-4 py-3 bg-card border-b" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-semibold truncate">{doc.title}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleDownload}><Download className="w-4 h-4 mr-1" /> Download</Button>
              <button onClick={() => setPreview(false)} className="p-1.5 hover:bg-muted rounded-lg"><XIcon className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe src={doc.file_url} className="w-full h-full" title={doc.title} />
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-secondary shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-sm line-clamp-2">{doc.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {doc.category && <StatusBadge status={doc.category} />}
              {doc.file_type && <span className="text-[10px] uppercase text-muted-foreground font-medium">{doc.file_type}</span>}
            </div>
            {doc.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{doc.description}</p>}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">{doc.download_count || 0} downloads</span>
              <div className="flex gap-1">
                {doc.file_url && (
                  <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs" onClick={() => setPreview(true)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-primary h-7 text-xs" onClick={handleDownload}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}