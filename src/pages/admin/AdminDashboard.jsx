import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Users, Calendar, FileText, Megaphone, ClipboardList, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";

const adminModules = [
  { to: "/admin/members", icon: Users, label: "Members", desc: "Manage member accounts", color: "bg-primary" },
  { to: "/admin/events", icon: Calendar, label: "Events", desc: "Manage events", color: "bg-knpi-dark-blue" },
  { to: "/admin/documents", icon: FileText, label: "Documents", desc: "Manage documents", color: "bg-knpi-maroon" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements", desc: "Manage news", color: "bg-knpi-golden" },
  { to: "/admin/requests", icon: ClipboardList, label: "Requests", desc: "Review requests", color: "bg-purple-600" },
  { to: "/admin/settings", icon: Settings, label: "Settings", desc: "Content & settings", color: "bg-gray-700" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, events: 0, docs: 0, requests: 0 });

  useEffect(() => {
    Promise.all([
      base44.entities.Member.list('-created_date', 1000).catch(() => []),
      base44.entities.Event.list('-created_date', 1000).catch(() => []),
      base44.entities.Document.list('-created_date', 1000).catch(() => []),
      base44.entities.ServiceRequest.list('-created_date', 1000).catch(() => []),
    ]).then(([m, e, d, r]) => {
      setStats({
        members: m.length,
        events: e.length,
        docs: d.length,
        requests: r.length,
        activeMembers: m.filter(x => x.status === 'active').length,
        pendingRequests: r.filter(x => x.status === 'submitted' || x.status === 'in_review').length,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Overview of all portal activities" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={stats.members} />
        <StatCard icon={Users} label="Active Members" value={stats.activeMembers || 0} />
        <StatCard icon={Calendar} label="Total Events" value={stats.events} />
        <StatCard icon={ClipboardList} label="Pending Requests" value={stats.pendingRequests || 0} />
      </div>

      <div>
        <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map(mod => (
            <Link
              key={mod.to}
              to={mod.to}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            >
              <div className={`w-10 h-10 rounded-lg ${mod.color} flex items-center justify-center mb-3`}>
                <mod.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-semibold">{mod.label}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{mod.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}