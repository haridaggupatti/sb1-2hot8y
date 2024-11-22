import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: api.getUserStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading || !stats) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="bg-gray-200 h-8 w-24 rounded"></div>
                <div className="mt-3 bg-gray-200 h-6 w-16 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Admin Users',
      value: stats.adminUsers,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.bgColor} rounded-md p-3`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd className="text-lg font-semibold text-gray-900">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Logins</h3>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentLogins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}