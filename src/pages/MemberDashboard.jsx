import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Calendar, FileText, Megaphone, ClipboardList, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import PageHeader from "@/components/shared/PageHeader";

export default function MemberDashboard() {
  const { user } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Announcement.filter({ published: true }, '-created_date', 5).catch(() => []),
      base44.entities.Event.filter({ status: 'upcoming' }, 'date', 5).catch(() => []),
      base44.entities.ServiceRequest.list('-created_date', 5).catch(() => []),
    ]).then(([a, e, r]) => {
      setAnnouncements(a);
      setEvents(e);
      setRequests(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Member'}`}
        description="Here's what's happening in your portal today."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Upcoming Events" value={events.length} />
        <StatCard icon={Megaphone} label="Announcements" value={announcements.length} />
        <StatCard icon={ClipboardList} label="My Requests" value={requests.length} />
        <StatCard icon={FileText} label="Documents" value="—" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-heading font-semibold">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="ghost" size="sm" className="text-primary">
                View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {events.length > 0 ? events.slice(0, 4).map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-secondary flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-heading font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                </div>
                <StatusBadge status={event.status} className="ml-auto shrink-0" />
              </Link>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No upcoming events</div>
            )}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-heading font-semibold">Latest Announcements</h2>
            <Link to="/announcements">
              <Button variant="ghost" size="sm" className="text-primary">
                View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {announcements.length > 0 ? announcements.slice(0, 4).map((a) => (
              <div key={a.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={a.category} />
                  {a.is_pinned && <span className="text-[10px] font-bold text-knpi-maroon">PINNED</span>}
                </div>
                <p className="font-medium text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.content}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No announcements</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-heading font-semibold">My Recent Requests</h2>
          <Link to="/requests">
            <Button variant="ghost" size="sm" className="text-primary">
              View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {requests.length > 0 ? requests.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center gap-4 p-4">
              <div className="p-2 rounded-lg bg-muted">
                {r.status === 'completed' || r.status === 'approved'
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : <Clock className="w-4 h-4 text-muted-foreground" />
                }
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.type?.replace(/_/g, ' ')}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground text-sm">No requests yet</div>
          )}
        </div>
      </div>
    </div>
  );
}