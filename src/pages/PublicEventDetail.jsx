import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus } from "lucide-react";
import CommentSection from "@/components/shared/CommentSection";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

const eventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=85",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&q=85",
];

export default function PublicEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const imgSrc = eventImages[Math.abs(id?.charCodeAt(0) || 0) % eventImages.length];

  useEffect(() => {
    base44.entities.Event.filter({ id }).then(res => setEvent(res[0])).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleLogin = () => base44.auth.redirectToLogin('/dashboard');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Event not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <PublicNavbar />

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img src={event.image_url || imgSrc} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status={event.status} />
              {event.type && <StatusBadge status={event.type} />}
              {event.is_featured && (
                <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">FEATURED</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            <CommentSection refId={id} refType="event" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-gray-900">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5"><Calendar className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-gray-900">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 mt-0.5"><MapPin className="w-4 h-4 text-primary" /></div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 mt-0.5"><Users className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="font-semibold text-gray-900">{event.registered_count || 0} / {event.capacity} spots</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, ((event.registered_count || 0) / event.capacity) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                )}
                {event.organizer && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 mt-0.5"><Clock className="w-4 h-4 text-primary" /></div>
                    <p className="font-medium text-gray-900">{event.organizer}</p>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleLogin} size="lg" className="w-full font-bold py-6" disabled={event.status === 'cancelled' || event.status === 'completed'}>
              <UserPlus className="w-4 h-4" /> Register for Event
            </Button>
            <p className="text-xs text-center text-gray-400">Login required to register</p>
          </div>
        </div>
      </div>
    </div>
  );
}