'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  const reports = [
    { href: '/reports/attendance', label: 'Attendance Report', desc: 'View delegate attendance statistics' },
    { href: '/reports/finance', label: 'Finance Report', desc: 'Revenue and expenses summary' },
    { href: '/reports/delegates', label: 'Delegates Report', desc: 'Delegate registration details' },
    { href: '/reports/accommodation', label: 'Accommodation Report', desc: 'Room allocation status' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Link key={report.href} href={report.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{report.label}</h3>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}