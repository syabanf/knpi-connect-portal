import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Settings, Database, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "sonner";

export default function AdminSettings() {
  const [seedLoading, setSeedLoading] = useState(false);

  const handleSeedData = async () => {
    if (!confirm("This will add sample data to your database. Continue?")) return;
    setSeedLoading(true);
    try {
      const res = await base44.functions.invoke('seedData', {});
      toast.success(`Sample data added: ${res.data.counts.members} members, ${res.data.counts.events} events, ${res.data.counts.announcements} announcements, ${res.data.counts.documents} documents, ${res.data.counts.requests} requests`);
    } catch (e) {
      toast.error(e.message || "Failed to seed data");
    }
    setSeedLoading(false);
  };

  return (
    <div>
      <PageHeader title="Admin Settings" description="System configuration and utilities" />

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-secondary shrink-0">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold mb-2">Seed Sample Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Populate the database with sample members, events, announcements, documents, and requests for testing and demo purposes.
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={handleSeedData} disabled={seedLoading} variant="outline">
                {seedLoading ? "Loading..." : "Add Sample Data"}
              </Button>
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Admin only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}