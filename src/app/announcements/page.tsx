'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newAnnouncement, setNewAnnouncement] = React.useState({ title: '', content: '' });

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAnnouncement,
          targetAudience: 'EVERYONE',
        }),
      });

      if (res.ok) {
        setNewAnnouncement({ title: '', content: '' });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Create Announcement */}
        <Card>
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Announcement content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                />
              </div>
              <Button onClick={handleCreateAnnouncement}>Publish Announcement</Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : announcements.length === 0 ? (
              <p className="text-gray-600">No announcements yet</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="border-l-4 border-primary-600 pl-4 py-2">
                    <h3 className="font-bold text-gray-900">{ann.title}</h3>
                    <p className="text-gray-600 text-sm">{ann.content}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(ann.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
