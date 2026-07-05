'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function ChurchManagementPage() {
  const [churches, setChurches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newChurch, setNewChurch] = React.useState({
    name: '', location: '', county: '', pastor: '', pastorPhone: ''
  });

  React.useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    try {
      const res = await fetch('/api/churches');
      const data = await res.json();
      setChurches(data.churches || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChurch = async () => {
    if (!newChurch.name || !newChurch.pastor) return;
    
    try {
      const res = await fetch('/api/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChurch),
      });

      if (res.ok) {
        setNewChurch({ name: '', location: '', county: '', pastor: '', pastorPhone: '' });
        fetchChurches();
        toast.success('Church registered successfully');
      }
    } catch (error) {
      toast.error('Failed to register church');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Register Church</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Church Name" value={newChurch.name} onChange={(e) => setNewChurch({...newChurch, name: e.target.value})} />
              <Input label="Location" value={newChurch.location} onChange={(e) => setNewChurch({...newChurch, location: e.target.value})} />
              <Input label="County" value={newChurch.county} onChange={(e) => setNewChurch({...newChurch, county: e.target.value})} />
              <Input label="Pastor Name" value={newChurch.pastor} onChange={(e) => setNewChurch({...newChurch, pastor: e.target.value})} />
              <Input label="Pastor Phone" value={newChurch.pastorPhone} onChange={(e) => setNewChurch({...newChurch, pastorPhone: e.target.value})} />
              <Button onClick={handleAddChurch} className="mt-6">Register Church</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Churches ({churches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Church Name</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">County</th>
                      <th className="px-4 py-2 text-left">Pastor</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churches.map((church) => (
                      <tr key={church.id} className="border-b">
                        <td className="px-4 py-2">{church.name}</td>
                        <td className="px-4 py-2">{church.location}</td>
                        <td className="px-4 py-2">{church.county}</td>
                        <td className="px-4 py-2">{church.pastor}</td>
                        <td className="px-4 py-2">{church.pastorPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}