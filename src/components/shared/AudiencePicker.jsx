import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

/**
 * AudiencePicker
 * Props:
 *  - mode: "announcement" | "event"
 *  - value: { target_audience, target_branches, target_positions, target_emails }
 *           OR { audience, audience_branches, audience_positions }
 *  - onChange(patch): callback with updated fields
 */
export default function AudiencePicker({ mode = "announcement", value = {}, onChange }) {
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  useEffect(() => {
    base44.entities.Member.list('full_name', 500).then(setMembers).catch(() => []);
  }, []);

  const branches = [...new Set(members.map(m => m.branch).filter(Boolean))];
  const positions = [...new Set(members.map(m => m.position).filter(Boolean))];

  // Field name helpers
  const audienceKey = mode === "announcement" ? "target_audience" : "audience";
  const branchesKey = mode === "announcement" ? "target_branches" : "audience_branches";
  const positionsKey = mode === "announcement" ? "target_positions" : "audience_positions";

  const audienceType = value[audienceKey] || "all";
  const selectedBranches = value[branchesKey] || [];
  const selectedPositions = value[positionsKey] || [];
  const selectedEmails = value.target_emails || [];

  const setAudienceType = (v) => onChange({ [audienceKey]: v, [branchesKey]: [], [positionsKey]: [], target_emails: [] });

  const toggleItem = (arr, item, key) => {
    const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    onChange({ [key]: next });
  };

  const filteredMembers = members.filter(m =>
    m.full_name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <Label>Audience</Label>
        <Select value={audienceType} onValueChange={setAudienceType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 All Members</SelectItem>
            <SelectItem value="branch">🏢 Specific Branch(es)</SelectItem>
            <SelectItem value="position">🎖️ Specific Position(s)</SelectItem>
            {mode === "announcement" && <SelectItem value="specific">👤 Specific Person(s)</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {audienceType === "branch" && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Select Branches</Label>
          {branches.length === 0 ? (
            <p className="text-xs text-muted-foreground">No branches found in member data.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {branches.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleItem(selectedBranches, b, branchesKey)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all font-medium ${
                    selectedBranches.includes(b)
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
          {selectedBranches.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Selected: {selectedBranches.join(", ")}</p>
          )}
        </div>
      )}

      {audienceType === "position" && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Select Positions</Label>
          {positions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No positions found in member data.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {positions.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleItem(selectedPositions, p, positionsKey)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all font-medium ${
                    selectedPositions.includes(p)
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          {selectedPositions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Selected: {selectedPositions.join(", ")}</p>
          )}
        </div>
      )}

      {audienceType === "specific" && mode === "announcement" && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Select Specific Members</Label>
          <Input
            placeholder="Search by name or email..."
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
            className="mb-2"
          />
          <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
            {filteredMembers.slice(0, 30).map(m => (
              <label key={m.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(m.email)}
                  onChange={() => toggleItem(selectedEmails, m.email, "target_emails")}
                  className="rounded"
                />
                <span className="text-sm font-medium">{m.full_name}</span>
                <span className="text-xs text-muted-foreground">{m.email}</span>
              </label>
            ))}
            {filteredMembers.length === 0 && (
              <p className="text-xs text-muted-foreground px-3 py-2">No members found.</p>
            )}
          </div>
          {selectedEmails.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedEmails.map(email => (
                <span key={email} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {email}
                  <button type="button" onClick={() => toggleItem(selectedEmails, email, "target_emails")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}