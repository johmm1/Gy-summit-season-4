'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newAccommodation, setNewAccommodation] = React.useState({
    name: '', type: 'HOSTEL', capacity: 0, totalBeds: 0, location: ''
  });

  React.useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const res = await fetch('/api/accommodation');
      const data = await res.json();
      setAccommodations(data.accommodations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccommodation = async () => {
    if (!newAccommodation.name || !newAccommodation.totalBeds) return;

    try {
      const res = await fetch('/api/accommodation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccommodation),
      });

      if (res.ok) {
        setNewAccommodation({ name: '', type: 'HOSTEL', capacity: 0, totalBeds: 0, location: '' });
        fetchAccommodations();
        toast.success('Accommodation added successfully');
      }
    } catch (error) {
      toast.error('Failed to add accommodation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Name" value={newAccommodation.name} onChange={(e) => setNewAccommodation({...newAccommodation, name: e.target.value})} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newAccommodation.type} onChange={(e) => setNewAccommodation({...newAccommodation, type: e.target.value})}>
                  <option value="HOSTEL">Hostel</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="SCHOOL">School</option>
                </select>
              </div>
              <Input label="Location" value={newAccommodation.location} onChange={(e) => setNewAccommodation({...newAccommodation, location: e.target.value})} />
              <Input label="Total Beds" type="number" value={newAccommodation.totalBeds} onChange={(e) => setNewAccommodation({...newAccommodation, totalBeds: parseInt(e.target.value)})} />
              <Input label="Capacity" type="number" value={newAccommodation.capacity} onChange={(e) => setNewAccommodation({...newAccommodation, capacity: parseInt(e.target.value)})} />
              <Button onClick={handleAddAccommodation} className="mt-6">Add Accommodation</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Accommodations ({accommodations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {accommodations.map((acc) => (
                  <div key={acc.id} className="border rounded-lg p-4">
                    <h3 className="font-bold">{acc.name}</h3>
                    <p className="text-sm text-gray-600">Type: {acc.type}</p>
                    <p className="text-sm text-gray-600">Beds: {acc.totalBeds}</p>
                    <p className="text-sm text-gray-600">Available: {acc.totalBeds - acc.occupiedBeds}</p>
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