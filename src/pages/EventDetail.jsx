import { useEffect, useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "sonner";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");

  useEffect(() => {
    base44.entities.Event.filter({ id }).then(res => setEvent(res[0])).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      setRegName(user.full_name || "");
      setRegEmail(user.email || "");
    }
  }, [user]);

  const handleRegister = async () => {
    if (!regName || !regEmail) { toast.error("Please fill in all fields"); return; }
    setRegistering(true);
    try {
      await base44.entities.EventRegistration.create({
        event_id: id,
        member_name: regName,
        member_email: regEmail,
        attendance_status: "registered",
      });
      await base44.entities.Event.update(id, { registered_count: (event.registered_count || 0) + 1 });
      setEvent(prev => ({ ...prev, registered_count: (prev.registered_count || 0) + 1 }));
      toast.success("Successfully registered!");
      setDialogOpen(false);
    } catch {
      toast.error("Registration failed. Please try again.");
    }
    setRegistering(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (!event) return <div className="text-center py-16 text-muted-foreground">Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary relative flex items-center justify-center">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <Calendar className="w-16 h-16 text-primary/20" />
          )}
        </div>

        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={event.status} />
            {event.type && <StatusBadge status={event.type} />}
            {event.is_featured && (
              <span className="bg-knpi-yellow text-knpi-dark text-[10px] font-bold px-2.5 py-0.5 rounded-full">FEATURED</span>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-heading font-bold">{event.title}</h1>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-secondary"><Calendar className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary"><MapPin className="w-4 h-4 text-primary" /></div>
                <p className="font-medium">{event.location}</p>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary"><Users className="w-4 h-4 text-primary" /></div>
                <p className="font-medium">{event.registered_count || 0} / {event.capacity} spots filled</p>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary"><Clock className="w-4 h-4 text-primary" /></div>
                <p className="font-medium">Organized by {event.organizer}</p>
              </div>
            )}
          </div>

          {event.description && (
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="font-heading font-semibold mb-2">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="mt-8">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto font-semibold" disabled={event.status === 'cancelled' || event.status === 'completed'}>
                  <UserPlus className="w-4 h-4 mr-2" /> Register for Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">Register for {event.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@email.com" type="email" />
                  </div>
                  <Button onClick={handleRegister} disabled={registering} className="w-full font-semibold">
                    {registering ? "Registering..." : "Confirm Registration"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}