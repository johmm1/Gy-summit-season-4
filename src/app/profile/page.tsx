'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = React.useState<any>(null);
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile`);
      const data = await res.json();
      setProfile(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    label="Name"
                    value={profile?.name || ''}
                    disabled={!editing}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                  <Input 
                    label="Email"
                    type="email"
                    value={profile?.email || ''}
                    disabled={!editing}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <Input 
                  label="Phone"
                  value={profile?.phone || ''}
                  disabled={!editing}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={!editing}
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  {editing ? (
                    <>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button onClick={() => setEditing(false)} variant="outline">Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold">{session.user?.role}</p>
            </div>
            <Button onClick={() => signOut({ redirect: true, callbackUrl: '/' })} variant="destructive">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
