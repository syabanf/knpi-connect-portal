import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, Megaphone, ArrowRight, ChevronRight, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const quickLinks = [
  { icon: Calendar, label: "Events", desc: "Browse upcoming events", to: "/events", color: "bg-primary" },
  { icon: FileText, label: "Documents", desc: "Access digital library", to: "/documents", color: "bg-knpi-maroon" },
  { icon: Megaphone, label: "Announcements", desc: "Latest updates", to: "/announcements", color: "bg-knpi-dark-blue" },
  { icon: Users, label: "Membership", desc: "Join our community", to: "/dashboard", color: "bg-knpi-golden" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    base44.entities.Announcement.filter({ published: true }, '-created_date', 3)
      .then(setAnnouncements).catch(() => {});
    base44.entities.Event.filter({ status: 'upcoming' }, 'date', 4)
      .then(setEvents).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold">K</span>
            </div>
            <span className="font-heading font-bold text-lg">KNPI Connect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#events" className="hover:text-primary transition-colors">Events</a>
            <a href="#news" className="hover:text-primary transition-colors">News</a>
          </nav>
          <Link to="/dashboard">
            <Button className="font-semibold">
              Go to Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5 mb-6">
                <Star className="w-3.5 h-3.5 text-knpi-yellow" />
                <span className="text-xs font-semibold text-secondary-foreground">KNPI Digital Portal</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
                Connect. Engage.{" "}
                <span className="text-primary">Empower.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
                Your centralized gateway to membership services, events, documents, and organizational resources — all in one platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard">
                  <Button size="lg" className="font-semibold px-8">
                    Access Portal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="font-semibold px-8">
                    Learn More
                  </Button>
                </a>
              </div>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="hidden lg:block">
              <img
                src="/__generating__/img_40f24e0f5bc5.png"
                alt="KNPI Connect Portal banner"
                className="rounded-2xl shadow-2xl border border-border"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-heading font-bold">
            Quick Access
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mt-2">
            Everything you need, one click away
          </motion.p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item, i) => (
            <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Link
                to={item.to}
                className="group block bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg">{item.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Announcements */}
      <section id="news" className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold">Latest News</h2>
              <p className="text-muted-foreground mt-1">Stay updated with the latest from KNPI</p>
            </div>
            <Link to="/announcements">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {announcements.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {announcements.map((a) => (
                <div key={a.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-secondary px-2 py-0.5 rounded-full">
                      {a.category}
                    </span>
                    {a.is_pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-knpi-maroon bg-red-50 px-2 py-0.5 rounded-full">Pinned</span>}
                  </div>
                  <h3 className="font-heading font-semibold line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
              <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No announcements yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold">Upcoming Events</h2>
            <p className="text-muted-foreground mt-1">Don't miss out on these opportunities</p>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all group">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-primary/40" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-primary">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <h3 className="font-heading font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">{e.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{e.location}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No upcoming events</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">K</span>
              </div>
              <span className="font-heading font-bold">KNPI Connect Portal</span>
            </div>
            <p className="text-sm opacity-60">© {new Date().getFullYear()} KNPI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}