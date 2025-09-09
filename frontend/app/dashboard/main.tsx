import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronUp, TrendingUp, Database, Activity, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../redux/store'; // Adjust the path if your store file is elsewhere
import { fetchBus } from 'redux/thunks/busThunks';
import LoadingOverlay from './busLoading';



type BusFormat = {
  date: string
  encoded: number
  updated: number
  issues: number
}

const EncodingDashboard = () => {
  // Redux
  const busData = useSelector((state: RootState) => state.bus);
  const User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // State

  const [AllBus, setAllBus] = useState<BusFormat[]>([]);
  // Sample data - replace with your actual data
  const [timeRange, setTimeRange] = useState('1d');

  useEffect(() => {
    if (User?.id) {
      dispatch(fetchBus({ userId: User.id, days: timeRange.slice(0, -1) }))

    }

  }, [dispatch, User, timeRange])

  useEffect(() => {
    console.log(busData.dailyEncodingData)
    if (busData) {
      setAllBus(busData.dailyEncodingData)
    }

  }, [dispatch, busData])


  const encodingTypeData = [
    { type: 'SWDI', name: "SWDI", count: 856, color: '#3B82F6' },
    { type: 'BUS', name: "BUS", count: 432, color: '#10B981' },
    { type: 'PCN', name: "PCN", count: 289, color: '#F59E0B' },
    { type: 'Document', name: "SWDI", count: 167, color: '#EF4444' },
  ];

  const recentEncodings = [
    { id: 'Bus_1', name: 'Alice Johnson', type: 'Bus', encoded: 'Yes', hh_id: 'HH101', date: '2025-09-01' },
    { id: 'PCN_1', name: 'Michael Smith', type: 'PCN', encoded: 'No', hh_id: 'HH102', date: '2025-09-02' },
    { id: 'SWDI_1', name: 'Sophia Lee', type: 'SWDI', encoded: 'Yes', hh_id: 'HH103', date: '2025-09-03' },
    { id: 'Bus_2', name: 'James Brown', type: 'Bus', encoded: 'No', hh_id: 'HH104', date: '2025-09-04' },
    { id: 'PCN_2', name: 'Emma Davis', type: 'PCN', encoded: 'Updated', hh_id: 'HH105', date: '2025-09-05' },
    { id: 'SWDI_2', name: 'Daniel Wilson', type: 'SWDI', encoded: 'Yes', hh_id: 'HH106', date: '2025-09-06' },
    { id: 'Bus_3', name: 'Olivia Martinez', type: 'Bus', encoded: 'No', hh_id: 'HH107', date: '2025-09-07' },
    { id: 'PCN_3', name: 'William Garcia', type: 'PCN', encoded: 'Yes', hh_id: 'HH108', date: '2025-09-08' },
    { id: 'SWDI_3', name: 'Isabella Thomas', type: 'SWDI', encoded: 'Updated', hh_id: 'HH109', date: '2025-09-09' },
  ]




  const totalStats = useMemo(() => {
    const totalEncoded = AllBus.reduce((sum, day) => sum + day.encoded, 0);
    const totalFailed = AllBus.reduce((sum, day) => sum + day.issues, 0);
    const totalUpdated = AllBus.reduce((sum, day) => sum + day.updated, 0);
    const successRate = isNaN(totalEncoded / (totalEncoded + totalFailed))
      ? 0
      : ((totalEncoded / (totalEncoded + totalFailed)) * 100).toFixed(1)


    return { totalEncoded, totalFailed, totalUpdated, successRate };
  }, [AllBus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (busData.loading && User.loading) {
    return <LoadingOverlay />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encoding Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your encoding performance and statistics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['1d', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Encoded</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalEncoded.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ +12% from last week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Encoded </p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.successRate}</p>
                <p className="text-sm text-green-600 mt-1">↗ +0.8% from last week</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Updated</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalUpdated}</p>
                <p className="text-sm text-red-600 mt-1">↘ -0.3s from last week</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ChevronUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600"> Issues</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalFailed}</p>
                <p className="text-sm text-red-600 mt-1">↗ +3 from last week</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Encoding Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Encoding Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={AllBus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="encoded"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Successfully Encoded"
                />
                <Area
                  type="monotone"
                  dataKey="issues"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                  name="issues"
                />
                <Area
                  type="monotone"
                  dataKey="updated"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                  name="updated"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Encoding Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Encoding by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={encodingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name }) => name}
                >
                  {encodingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* 
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Performance (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpu_usage"
                stroke="#3B82F6"
                strokeWidth={2}
                name="CPU Usage (%)"
              />
              <Line
                type="monotone"
                dataKey="memory_usage"
                stroke="#10B981"
                strokeWidth={2}
                name="Memory Usage (%)"
              />
              <Line
                type="monotone"
                dataKey="throughput"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Throughput (files/min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
 */}
        {/* Recent Encodings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Encodings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HH ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encoded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEncodings.map((encoding) => (
                  <tr key={encoding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {encoding.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {encoding.hh_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 truncate max-w-xs">
                          {encoding.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {encoding.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(encoding.encoded)}`}>
                        {getStatusIcon(encoding.encoded)}
                        <span className="ml-1">{encoding.encoded}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {encoding.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncodingDashboard;