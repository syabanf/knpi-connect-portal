import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import CommentSection from "@/components/shared/CommentSection";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

const newsImages = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85",
  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=900&q=85",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=85",
];

export default function PublicNewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [others, setOthers] = useState([]);
  const imgSrc = newsImages[Math.abs(id?.charCodeAt(0) || 0) % newsImages.length];

  useEffect(() => {
    base44.entities.Announcement.filter({ id }).then(res => setItem(res[0])).catch(() => {}).finally(() => setLoading(false));
    base44.entities.Announcement.filter({ published: true }, '-created_date', 4).then(res => setOthers(res.filter(a => a.id !== id).slice(0, 3))).catch(() => {});
  }, [id]);

  const handleLogin = () => base44.auth.redirectToLogin('/dashboard');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Announcement not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <PublicNavbar />

      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={item.image_url || imgSrc} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <StatusBadge status={item.category} />
                <StatusBadge status={item.priority} />
                {item.is_pinned && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full uppercase">Pinned</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 leading-tight">{item.title}</h1>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">{item.content}</p>
              </div>
            </div>
            <CommentSection refId={id} refType="news" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-heading font-bold text-gray-900 mb-4">Other News</h3>
              {others.map((a, i) => (
                <a key={a.id} href={`/news/${a.id}`} className="flex gap-3 mb-4 group">
                  <img src={newsImages[i % newsImages.length]} alt={a.title} className="w-16 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(a.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="bg-primary rounded-2xl p-6 text-white text-center">
              <h4 className="font-heading font-bold text-lg mb-2">Access Full Portal</h4>
              <p className="text-blue-100 text-sm mb-4">Login to access all member features and resources.</p>
              <Button onClick={handleLogin} className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold">
                Login Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}