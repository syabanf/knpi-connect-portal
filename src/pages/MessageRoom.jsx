import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Send, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MessageRoom() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadThread();
    }
  }, [user, threadId]);

  const loadThread = async () => {
    try {
      const allMessages = await base44.entities.Message.filter({}, '-created_date', 500).catch(() => []);
      const threadMessages = allMessages.filter(m => (m.thread_id || m.id) === threadId);
      
      if (threadMessages.length === 0) {
        toast.error("Thread not found");
        navigate("/messages");
        return;
      }

      const sorted = threadMessages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
      setMessages(sorted);
      
      const threadData = {
        id: threadId,
        subject: threadMessages[0].subject,
        messages: sorted,
      };
      setThread(threadData);

      // Mark unread as read
      const unread = sorted.filter(m => !m.is_read && m.recipient_email === user?.email);
      await Promise.all(unread.map(m => base44.entities.Message.update(m.id, { is_read: true })));
    } catch (error) {
      toast.error("Failed to load thread");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    
    const lastMsg = messages[messages.length - 1];
    const isSender = lastMsg.sender_email === user?.email;
    const recipientEmail = isSender ? lastMsg.recipient_email : lastMsg.sender_email;
    const recipientName = isSender ? lastMsg.recipient_name : lastMsg.sender_name;
    
    setSending(true);
    try {
      await base44.entities.Message.create({
        sender_email: user.email,
        sender_name: user.full_name,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        subject: `Re: ${thread.subject.replace(/^Re: /, "")}`,
        body: replyBody,
        thread_id: threadId,
        is_read: false,
      });
      setReplyBody("");
      toast.success("Reply sent!");
      await loadThread();
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (!thread) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="font-heading font-bold text-lg">{thread.subject}</h1>
          <p className="text-sm text-muted-foreground">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {messages.map(m => {
          const isMe = m.sender_email === user?.email;
          return (
            <div key={m.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{isMe ? "You" : m.sender_name || m.sender_email}</span>
                  <span className="text-[11px] text-muted-foreground">{new Date(m.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isMe ? "bg-primary text-white rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"}`}>
                  {m.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <Textarea
          placeholder="Write a reply..."
          value={replyBody}
          onChange={e => setReplyBody(e.target.value)}
          rows={3}
          className="mb-3 resize-none"
        />
        <Button onClick={handleReply} disabled={sending || !replyBody.trim()} className="font-semibold">
          <Send className="w-4 h-4 mr-2" /> {sending ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </div>
  );
}