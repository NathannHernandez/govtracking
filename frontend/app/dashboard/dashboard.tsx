import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronUp, TrendingUp, Database, Activity, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import LoadingOverlay from './overlayLoading';
import { useQuery } from '@tanstack/react-query';
import type { JSX } from 'react/jsx-runtime';

type EncodedDocument = {
  id: number;
  hhId: string;
  name: string;
  documentType: string;
  encoded: "YES" | "NO" | "UPDATED" | "PENDING";
  userId: number;
  username: string;
  date: string;
  createdAt: string;
};

const statusMap: Record<EncodedDocument['encoded'], { color: string; icon: JSX.Element }> = {
  YES: { color: 'text-green-600 bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
  NO: { color: 'text-red-600 bg-red-100', icon: <AlertTriangle className="w-4 h-4" /> },
  UPDATED: { color: 'text-yellow-600 bg-yellow-100', icon: <ChevronUp className="w-4 h-4" /> },
  PENDING: { color: 'text-blue-600 bg-blue-100', icon: <Clock className="w-4 h-4" /> }
};


const fetchData = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' , method: 'GET' });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const EncodingDashboard = () => {
  const User = useSelector((state: RootState) => state.user);
  const [timeRange, setTimeRange] = useState('1d');

  const { data: recentEncodings } = useQuery<EncodedDocument[]>({
    queryKey: ['recentData', User.id],
    queryFn: () => fetchData(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/recent?id=${User.id}`),
    enabled: !!User.id,
  });

  const { data: dailyStats } = useQuery<EncodedDocument[]>({
    queryKey: ['dailyStats', User.id, timeRange],
    queryFn: () => fetchData(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/dailystats?id=${User.id}&days=${timeRange.slice(0, -1)}`),
    enabled: !!User.id,
  });

  const { data: allEncodedData } = useQuery<EncodedDocument[]>({
    queryKey: ['allData', User.id, timeRange],
    queryFn: () => fetchData(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/total?id=${User.id}&days=${timeRange.slice(0, -1)}`),
    enabled: !!User.id,
  });

  const stats = useMemo(() => {
    const data = allEncodedData || [];
    const counts = { total_encoded: data.length, encoded: 0, updated: 0, issues: 0 };
    data.forEach(d => {
      if (d.encoded === "YES") counts.encoded++;
      if (d.encoded === "UPDATED") counts.updated++;
      if (d.encoded === "NO") counts.issues++;
    });
    return counts;
  }, [allEncodedData]);

  const encodingTypeData = useMemo(() => {
    const data = allEncodedData || [];
    const counts = data.reduce<Record<string, number>>((acc, d) => {
      acc[d.documentType] = (acc[d.documentType] || 0) + 1;
      return acc;
    }, {});
    const colors: Record<string, string> = { SWDI: '#3B82F6', BUS: '#10B981', PCN: '#F59E0B', Document: '#EF4444' };
    return Object.entries(counts).map(([type, count]) => ({ type, name: type, count, color: colors[type] || '#888888' }));
  }, [allEncodedData]);

  if (!recentEncodings) return <LoadingOverlay />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encoding Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your encoding performance and statistics</p>
        </div>

        <div className="mb-6 flex space-x-2">
          {['1d', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Encoded', value: stats.total_encoded, color: 'blue', icon: <Database className="w-6 h-6 text-blue-600" /> },
            { title: 'Encoded', value: stats.encoded, color: 'green', icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
            { title: 'Updated', value: stats.updated, color: 'yellow', icon: <ChevronUp className="w-6 h-6 text-yellow-600" /> },
            { title: 'Issues', value: stats.issues, color: 'red', icon: <AlertTriangle className="w-6 h-6 text-red-600" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm text-${stat.color}-600 mt-1`}>↗ +12% from last week</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Encoding Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="encoded" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Encoded" />
                <Area type="monotone" dataKey="updated" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Updated" />
                <Area type="monotone" dataKey="issues" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Issues" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Encoding by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={encodingTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" label={({ name }) => name}>
                  {encodingTypeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Encodings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'HH ID', 'Name', 'Type', 'Encoded', 'Date'].map((col, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEncodings.map((enc) => {
                  const { color, icon } = statusMap[enc.encoded];
                  return (
                    <tr key={enc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{enc.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{enc.hhId}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 truncate max-w-xs">{enc.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enc.documentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                          {icon}<span className="ml-1">{enc.encoded}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enc.date).toISOString().split("T")[0]}
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EncodingDashboard;
