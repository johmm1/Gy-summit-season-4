'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function SportsTeamsPage() {
  const [teams, setTeams] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newTeam, setNewTeam] = React.useState({ name: '', sport: 'FOOTBALL', church: '' });

  React.useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/sports-teams');
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.church) return;

    try {
      const res = await fetch('/api/sports-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam),
      });

      if (res.ok) {
        setNewTeam({ name: '', sport: 'FOOTBALL', church: '' });
        fetchTeams();
        toast.success('Team registered successfully');
      }
    } catch (error) {
      toast.error('Failed to register team');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Register Sports Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newTeam.sport} onChange={(e) => setNewTeam({...newTeam, sport: e.target.value})}>
                  <option value="FOOTBALL">Football</option>
                  <option value="VOLLEYBALL">Volleyball</option>
                  <option value="DANCE">Dance</option>
                </select>
              </div>
              <Input label="Church" value={newTeam.church} onChange={(e) => setNewTeam({...newTeam, church: e.target.value})} />
              <Button onClick={handleAddTeam} className="mt-6">Register Team</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Teams ({teams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <div key={team.id} className="border rounded-lg p-4">
                    <h3 className="font-bold">{team.name}</h3>
                    <p className="text-sm text-gray-600">Sport: {team.sport}</p>
                    <p className="text-sm text-gray-600">Church: {team.church}</p>
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