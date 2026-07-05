'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const COLORS = ['#3d4af5', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data.stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session, router]);

  if (!session) return null;

  const chartData = [
    { name: 'Delegates', value: stats?.totalDelegates || 0 },
    { name: 'Checked In', value: stats?.checkedInDelegates || 0 },
    { name: 'Pending', value: stats?.pendingApprovals || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">GY Summit</div>
          <div className="space-x-4">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
            <Button onClick={() => {}}>Logout</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user?.name}</h1>
          <p className="text-gray-600">Role: {session.user?.role}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Total Delegates</p>
                  <p className="text-3xl font-bold text-primary-600">{stats?.totalDelegates}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Checked In</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.checkedInDelegates}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats?.pendingApprovals}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Churches</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalChurches}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Accommodations</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalAccommodations}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">Announcements</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.totalAnnouncements}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3d4af5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delegate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button className="w-full">Register Delegate</Button>
                  <Button className="w-full" variant="outline">View Attendees</Button>
                  <Button className="w-full" variant="outline">Send Announcement</Button>
                  <Button className="w-full" variant="outline">Generate Reports</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
