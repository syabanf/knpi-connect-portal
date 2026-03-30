import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CommentSection({ refId, refType }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.entities.Comment.filter({ ref_id: refId, ref_type: refType }, '-created_date', 50)
      .then(setComments).catch(() => {});
  }, [refId, refType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    const comment = await base44.entities.Comment.create({
      ref_id: refId,
      ref_type: refType,
      author_name: name.trim(),
      content: content.trim(),
    });
    setComments(prev => [comment, ...prev]);
    setContent("");
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6">
      <h3 className="font-heading font-bold text-gray-900 mb-5 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <Input
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          rows={3}
          placeholder="Write a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <Button type="submit" disabled={submitting} className="gap-2">
          <Send className="w-4 h-4" />
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">{c.author_name[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{c.author_name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}