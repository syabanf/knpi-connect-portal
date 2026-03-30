import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Calendar, FileText, ClipboardList, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";

const COLORS = ['hsl(222,68%,58%)', 'hsl(60,94%,48%)', 'hsl(348,72%,21%)', 'hsl(222,54%,47%)', 'hsl(55,84%,43%)'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Member.list('-created_date', 1000).catch(() => []),
      base44.entities.Event.list('-date', 1000).catch(() => []),
      base44.entities.Document.list('-created_date', 1000).catch(() => []),
      base44.entities.ServiceRequest.list('-created_date', 1000).catch(() => []),
      base44.entities.EventRegistration.list('-created_date', 1000).catch(() => []),
    ]).then(([members, events, docs, requests, registrations]) => {
      setData({ members, events, docs, requests, registrations });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const { members, events, docs, requests, registrations } = data;

  // Member status distribution
  const memberStatus = ['active', 'pending', 'inactive', 'suspended'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: members.filter(m => m.status === s).length,
  })).filter(d => d.value > 0);

  // Event type distribution
  const eventTypes = ['seminar', 'workshop', 'conference', 'meeting', 'social', 'training'].map(t => ({
    name: t.charAt(0).toUpperCase() + t.slice(1),
    value: events.filter(e => e.type === t).length,
  })).filter(d => d.value > 0);

  // Request status
  const requestStatus = ['submitted', 'in_review', 'approved', 'rejected', 'completed'].map(s => ({
    name: s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: requests.filter(r => r.status === s).length,
  })).filter(d => d.value > 0);

  // Monthly members (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const m = d.getMonth();
    monthlyData.push({
      name: month,
      members: members.filter(mem => {
        const cd = new Date(mem.created_date);
        return cd.getMonth() === m && cd.getFullYear() === year;
      }).length,
      events: events.filter(ev => {
        const cd = new Date(ev.created_date);
        return cd.getMonth() === m && cd.getFullYear() === year;
      }).length,
    });
  }

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingRequests = requests.filter(r => r.status === 'submitted' || r.status === 'in_review').length;
  const totalDownloads = docs.reduce((sum, d) => sum + (d.download_count || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics & Reports" description="Insights into portal activity and engagement" />

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={members.length} />
        <StatCard icon={CheckCircle2} label="Active Members" value={activeMembers} />
        <StatCard icon={Calendar} label="Total Events" value={events.length} />
        <StatCard icon={TrendingUp} label="Event Registrations" value={registrations.length} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Documents" value={docs.length} />
        <StatCard icon={FileText} label="Total Downloads" value={totalDownloads} />
        <StatCard icon={ClipboardList} label="Total Requests" value={requests.length} />
        <StatCard icon={Clock} label="Pending Requests" value={pendingRequests} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="members" stroke="hsl(222,68%,58%)" strokeWidth={2} name="New Members" />
              <Line type="monotone" dataKey="events" stroke="hsl(348,72%,21%)" strokeWidth={2} name="New Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Member Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Member Status</h3>
          {memberStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={memberStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {memberStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">No data</div>
          )}
        </div>

        {/* Event Types */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Events by Type</h3>
          {eventTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(222,68%,58%)" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">No data</div>
          )}
        </div>

        {/* Request Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Requests by Status</h3>
          {requestStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={requestStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {requestStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}