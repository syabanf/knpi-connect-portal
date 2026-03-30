import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    base44.entities.Event.list('-date', 50).then(setEvents).catch(() => []).finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <PageHeader title="Events" description="Discover and register for upcoming events" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-36 bg-gradient-to-br from-primary/10 to-secondary relative flex items-center justify-center">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <Calendar className="w-12 h-12 text-primary/30" />
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={event.status} />
                </div>
                {event.is_featured && (
                  <div className="absolute top-3 left-3 bg-knpi-yellow text-knpi-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                    FEATURED
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {event.title}
                </h3>
                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Users className="w-3.5 h-3.5" />
                    {event.registered_count || 0} / {event.capacity} registered
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={Calendar} title="No events found" description="Try adjusting your search or check back later." />
      )}
    </div>
  );
}