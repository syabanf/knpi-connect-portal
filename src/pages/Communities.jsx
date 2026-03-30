import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users2, Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    is_public: true,
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const data = await base44.entities.Community.list();
      setCommunities(data);
    } catch (error) {
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    if (!formData.name.trim()) {
      toast.error('Community name is required');
      return;
    }

    try {
      await base44.entities.Community.create(formData);
      toast.success('Community created successfully');
      setShowForm(false);
      setFormData({ name: '', description: '', category: 'other', is_public: true });
      fetchCommunities();
    } catch (error) {
      toast.error('Failed to create community');
    }
  };

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communities"
        description="Explore and join communities aligned with your interests"
      >
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Community
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-6">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredCommunities.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No communities yet"
          description="Create a community or explore existing ones"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              {community.image_url && (
                <img
                  src={community.image_url}
                  alt={community.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-heading font-semibold text-lg mb-2">
                {community.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {community.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <StatusBadge status={community.status} />
                  <StatusBadge status={community.category} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Start a new community to connect with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Community Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter community name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your community"
                className="w-full border border-input rounded-md p-2 text-sm"
                rows="3"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCreateCommunity}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}