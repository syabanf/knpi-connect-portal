import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { User, Mail, Phone, MapPin, Building, Briefcase, Edit, Save, X, Calendar, Hash, Star, GitBranch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "sonner";

export default function MemberProfile() {
  const { user } = useOutletContext();
  const [member, setMember] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.email) {
      base44.entities.Member.filter({ email: user.email }, '-created_date', 1)
        .then(res => {
          if (res.length > 0) {
            setMember(res[0]);
            setForm(res[0]);
          } else {
            const newMember = { full_name: user.full_name, email: user.email, status: "active" };
            setForm(newMember);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (member) {
        await base44.entities.Member.update(member.id, form);
        setMember({ ...member, ...form });
      } else {
        const created = await base44.entities.Member.create(form);
        setMember(created);
      }
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile.");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  const data = member || form;
  const initials = data.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="My Profile" description="Manage your membership information">
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditing(false); setForm(member || {}); }}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}</Button>
          </div>
        )}
      </PageHeader>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary p-6 flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-card">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-heading font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-heading font-bold">{data.full_name || "New Member"}</h2>
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              {data.status && <StatusBadge status={data.status} />}
              {data.membership_type && <StatusBadge status={data.membership_type} />}
              {data.member_id && <span className="text-xs text-muted-foreground">ID: {data.member_id}</span>}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={form.full_name || ""} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} type="email" /></div>
              <div><Label>Phone</Label><Input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Member ID</Label><Input value={form.member_id || ""} onChange={e => setForm({ ...form, member_id: e.target.value })} /></div>
              <div>
                <Label>Membership Type</Label>
                <Select value={form.membership_type || "regular"} onValueChange={v => setForm({ ...form, membership_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="honorary">Honorary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Join Date</Label><Input value={form.join_date || ""} onChange={e => setForm({ ...form, join_date: e.target.value })} type="date" /></div>
              <div><Label>Position</Label><Input value={form.position || ""} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="e.g. Secretary" /></div>
              <div><Label>Branch / Chapter</Label><Input value={form.branch || ""} onChange={e => setForm({ ...form, branch: e.target.value })} placeholder="e.g. DKI Jakarta" /></div>
              <div><Label>Occupation</Label><Input value={form.occupation || ""} onChange={e => setForm({ ...form, occupation: e.target.value })} /></div>
              <div><Label>Organization</Label><Input value={form.organization || ""} onChange={e => setForm({ ...form, organization: e.target.value })} /></div>
              <div><Label>City</Label><Input value={form.city || ""} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Bio</Label><Textarea value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <ProfileField icon={Mail} label="Email" value={data.email} />
              <ProfileField icon={Phone} label="Phone" value={data.phone} />
              <ProfileField icon={Hash} label="Member ID" value={data.member_id} />
              <ProfileField icon={Star} label="Membership Type" value={data.membership_type} />
              <ProfileField icon={Calendar} label="Join Date" value={data.join_date} />
              <ProfileField icon={User} label="Position" value={data.position} />
              <ProfileField icon={GitBranch} label="Branch / Chapter" value={data.branch} />
              <ProfileField icon={Briefcase} label="Occupation" value={data.occupation} />
              <ProfileField icon={Building} label="Organization" value={data.organization} />
              <ProfileField icon={MapPin} label="City" value={data.city} />
              <ProfileField icon={MapPin} label="Address" value={data.address} />
              {data.bio && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-1">Bio</p>
                  <p className="text-sm">{data.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-secondary shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">{label}</p>
        <p className="text-sm font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );
}