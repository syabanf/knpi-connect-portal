import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Send, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function Messages() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ recipient_email: "", recipient_name: "", subject: "", body: "" });
  const [memberSearch, setMemberSearch] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadMessages().catch(() => {
        setMessages([]);
        setLoading(false);
      });
      base44.entities.Member.list('full_name', 200).then(setMembers).catch(() => setMembers([]));
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      const [inbox, sent] = await Promise.all([
        base44.entities.Message.filter({ recipient_email: user.email }, '-created_date', 200).catch(() => []),
        base44.entities.Message.filter({ sender_email: user.email }, '-created_date', 200).catch(() => []),
      ]);
      const all = [...inbox, ...sent].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setMessages(all);
    } finally {
      setLoading(false);
    }
  };

  // Group into threads
  const threads = Object.values(
    messages.reduce((acc, m) => {
      const tid = m.thread_id || m.id;
      if (!acc[tid]) acc[tid] = { id: tid, subject: m.subject, messages: [], lastDate: m.created_date, unread: 0 };
      acc[tid].messages.push(m);
      if (!m.is_read && m.recipient_email === user?.email) acc[tid].unread++;
      if (new Date(m.created_date) > new Date(acc[tid].lastDate)) acc[tid].lastDate = m.created_date;
      return acc;
    }, {})
  ).sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

  const filteredThreads = threads.filter(t =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.messages.some(m => m.sender_name?.toLowerCase().includes(search.toLowerCase()) || m.body?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCompose = async () => {
    if (!form.recipient_email || !form.subject || !form.body) { toast.error("All fields required"); return; }
    setSending(true);
    try {
      const msg = await base44.entities.Message.create({
        ...form,
        sender_email: user.email,
        sender_name: user.full_name,
        is_read: false,
      });
      toast.success("Message sent!");
      setComposeOpen(false);
      setForm({ recipient_email: "", recipient_name: "", subject: "", body: "" });
      await loadMessages();
    } catch { toast.error("Failed to send."); }
    setSending(false);
  };

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const filteredMembers = members.filter(m =>
    m.email !== user?.email &&
    (m.full_name?.toLowerCase().includes(memberSearch.toLowerCase()) || m.email?.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Messages" description={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "Your inbox"}>
        <Button onClick={() => setComposeOpen(true)} className="font-semibold">
          <Plus className="w-4 h-4 mr-2" /> New Message
        </Button>
      </PageHeader>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filteredThreads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages" description="Start a conversation with another member." >
          <Button onClick={() => setComposeOpen(true)} variant="outline"><Plus className="w-4 h-4 mr-2" /> New Message</Button>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {filteredThreads.map(thread => {
            const lastMsg = thread.messages.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
            const isFromMe = lastMsg.sender_email === user?.email;
            const otherName = isFromMe ? lastMsg.recipient_name || lastMsg.recipient_email : lastMsg.sender_name || lastMsg.sender_email;
            return (
              <div
                key={thread.id}
                onClick={() => navigate(`/messages/${thread.id}`)}
                className={`bg-card border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-all flex gap-3 ${thread.unread > 0 ? "border-primary/30 bg-primary/5" : "border-border"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${thread.unread > 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${thread.unread > 0 ? "text-primary" : ""}`}>{otherName}</span>
                    <div className="flex items-center gap-2">
                      {thread.unread > 0 && (
                        <span className="text-[10px] bg-primary text-white font-bold px-1.5 py-0.5 rounded-full">{thread.unread}</span>
                      )}
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(thread.lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm truncate ${thread.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>{thread.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>To (Member)</Label>
              <Input placeholder="Search member..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="mb-1" />
              {memberSearch && filteredMembers.length > 0 && (
                <div className="border border-border rounded-lg max-h-36 overflow-y-auto">
                  {filteredMembers.slice(0, 10).map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex justify-between"
                      onClick={() => {
                        setForm({ ...form, recipient_email: m.email, recipient_name: m.full_name });
                        setMemberSearch(m.full_name);
                      }}
                    >
                      <span className="font-medium">{m.full_name}</span>
                      <span className="text-muted-foreground text-xs">{m.branch || m.position || ""}</span>
                    </button>
                  ))}
                </div>
              )}
              {form.recipient_email && (
                <div className="flex items-center gap-2 mt-1 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                  <User className="w-3 h-3" />
                  <span>{form.recipient_name} — {form.recipient_email}</span>
                  <button onClick={() => { setForm({ ...form, recipient_email: "", recipient_name: "" }); setMemberSearch(""); }} className="ml-auto">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Message subject" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={4} placeholder="Write your message..." />
            </div>
            <Button onClick={handleCompose} disabled={sending} className="w-full font-semibold">
              <Send className="w-4 h-4 mr-2" /> {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}