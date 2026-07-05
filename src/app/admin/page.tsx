'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const adminLinks = [
    { href: '/admin/users', label: 'User Management', icon: '👥' },
    { href: '/admin/churches', label: 'Churches', icon: '⛪' },
    { href: '/admin/sports-teams', label: 'Sports Teams', icon: '⚽' },
    { href: '/admin/accommodation', label: 'Accommodation', icon: '🏨' },
    { href: '/reports/attendance', label: 'Attendance', icon: '📋' },
    { href: '/announcements', label: 'Announcements', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{link.icon}</div>
                  <p className="font-semibold text-gray-900">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}