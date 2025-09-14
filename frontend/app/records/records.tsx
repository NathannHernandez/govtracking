import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "redux/store";
import { Search, Filter, X, Calendar, User, FileText, Copy, ChevronDown } from 'lucide-react';

// Types based on your Prisma schema
type BusData = {
  id: number;
  username: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  encoded: 'YES' | 'NO' | 'UPDATED' | 'PENDING';
  issue?: string;
  subjectOfChange: string;
  date: string;
  userId: number;
};

type SwdiData = {
  id: number;
  username: string;
  hhId: string;
  grantee: string;
  swdiScore: string;
  encoded: 'YES' | 'NO' | 'UPDATED' | 'PENDING';
  issue?: string;
  date: string;
  userId: number;
};

type PcnData = {
  id: number;
  username: string;
  hhId: string;
  grantee: string;
  pcn?: string;
  tr?: string;
  encoded: 'YES' | 'NO' | 'UPDATED' | 'PENDING';
  issue?: string;
  date: string;
  userId: number;
};

type DataType = 'BUS' | 'SWDI' | 'PCN';
type AllData = BusData | SwdiData | PcnData;

interface FilterState {
  search: string;
  encoded: string;
  dateFrom: string;
  dateTo: string;
  username: string;
}

export default function DataSearchFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  
  const [activeDataType, setActiveDataType] = useState<DataType>('BUS');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    encoded: '',
    dateFrom: '',
    dateTo: '',
    username: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch BUS data
  const { data: busData = [], isLoading: busLoading, refetch: refetchBus } = useQuery<BusData[]>({
    queryKey: ['busData', user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/bus/records?id=${user.id}`,{
                method: 'GET',
                credentials: 'include',
            });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!user.id && activeDataType === 'BUS'
  });

  // Fetch SWDI data
  const { data: swdiData = [], isLoading: swdiLoading, refetch: refetchSwdi } = useQuery<SwdiData[]>({
    queryKey: ['swdiData', user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/swdi/records?id=${user.id}`,{
                method: 'GET',
                credentials: 'include',
            });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!user.id && activeDataType === 'SWDI'
  });

  // Fetch PCN data
  const { data: pcnData = [], isLoading: pcnLoading, refetch: refetchPcn } = useQuery<PcnData[]>({
    queryKey: ['pcnData', user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/records?id=${user.id}`,{
                method: 'GET',
                credentials: 'include',
            });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!user.id && activeDataType === 'PCN'
  });

  // Get current data and loading state based on active data type
  const getCurrentData = (): AllData[] => {
    switch (activeDataType) {
      case 'BUS': return busData;
      case 'SWDI': return swdiData;
      case 'PCN': return pcnData;
      default: return [];
    }
  };

  const getCurrentLoading = (): boolean => {
    switch (activeDataType) {
      case 'BUS': return busLoading;
      case 'SWDI': return swdiLoading;
      case 'PCN': return pcnLoading;
      default: return false;
    }
  };

  const getCurrentRefetch = () => {
    switch (activeDataType) {
      case 'BUS': return refetchBus;
      case 'SWDI': return refetchSwdi;
      case 'PCN': return refetchPcn;
      default: return () => {};
    }
  };

  const currentData = getCurrentData();
  const isLoading = getCurrentLoading();
  const currentRefetch = getCurrentRefetch();

  // Get unique usernames for filter dropdown
  const uniqueUsernames = useMemo(() => {
    const usernames = currentData.map(item => item.username).filter(Boolean);
    return [...new Set(usernames)].sort();
  }, [currentData]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return currentData.filter(item => {
      // Search filter - searches across multiple fields based on data type
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        let searchFields: string[] = [];
        
        if (activeDataType === 'BUS') {
          const busItem = item as BusData;
          searchFields = [
            busItem.hhId,
            busItem.granteeName,
            busItem.lgu,
            busItem.barangay,
            busItem.typeOfUpdate,
            busItem.subjectOfChange,
            busItem.issue || ''
          ];
        } else if (activeDataType === 'SWDI') {
          const swdiItem = item as SwdiData;
          searchFields = [
            swdiItem.hhId,
            swdiItem.grantee,
            swdiItem.swdiScore,
            swdiItem.issue || ''
          ];
        } else if (activeDataType === 'PCN') {
          const pcnItem = item as PcnData;
          searchFields = [
            pcnItem.hhId,
            pcnItem.grantee,
            pcnItem.pcn || '',
            pcnItem.tr || '',
            pcnItem.issue || ''
          ];
        }
        
        const matchesSearch = searchFields.some(field => 
          field.toLowerCase().includes(searchTerm)
        );
        if (!matchesSearch) return false;
      }

      // Encoded filter
      if (filters.encoded && item.encoded !== filters.encoded) {
        return false;
      }


      // Date range filter
      const itemDate = new Date(item.date);
      if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && itemDate > new Date(filters.dateTo + 'T23:59:59')) {
        return false;
      }

      return true;
    });
  }, [currentData, filters, activeDataType]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change or data type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeDataType]);

  // Clear filters when switching data types
  useEffect(() => {
    setFilters({
      search: '',
      encoded: '',
      dateFrom: '',
      dateTo: '',
      username: ''
    });
  }, [activeDataType]);

  const handleEdit = (id: number) => {
    const entryToEdit = currentData.find(entry => entry.id === id);
    if (!entryToEdit) return;

    const { date, ...rest } = entryToEdit;
    const dt = new Date(date);
    const formatted =
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}T` +
      `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;

    // Dispatch to appropriate slice based on data type
    if (activeDataType === 'BUS') {
      // dispatch(setCurrentBus({ ...rest, date: formatted }));
    } else if (activeDataType === 'SWDI') {
      // dispatch(setCurrentSwdi({ ...rest, date: formatted }));
    } else if (activeDataType === 'PCN') {
      // dispatch(setCurrentPcn({ ...rest, date: formatted }));
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      encoded: '',
      dateFrom: '',
      dateTo: '',
      username: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getEncodedBadgeClass = (encoded: string) => {
    switch (encoded) {
      case 'YES':
        return 'bg-green-100 text-green-800';
      case 'NO':
        return 'bg-red-100 text-red-800';
      case 'UPDATED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTableHeaders = () => {
    const commonHeaders = ['HH ID', 'Encoded', 'Issue', 'Date', 'Actions'];
    
    if (activeDataType === 'BUS') {
      return ['LGU', 'Barangay', ...commonHeaders.slice(0, 1), 'Grantee', 'Type of Update', 'Subject of Change', ...commonHeaders.slice(1)];
    } else if (activeDataType === 'SWDI') {
      return [...commonHeaders.slice(0, 1), 'Grantee', 'SWDI Score', ...commonHeaders.slice(1)];
    } else if (activeDataType === 'PCN') {
      return [...commonHeaders.slice(0, 1), 'Grantee', 'PCN', 'TR', ...commonHeaders.slice(1)];
    }
    return commonHeaders;
  };

  const renderTableRow = (item: AllData, index: number) => {
    const baseClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";
    
    return (
      <tr key={item.id} className={baseClass}>
        {activeDataType === 'BUS' && (
          <>
            <td className="px-4 py-3">{(item as BusData).lgu}</td>
            <td className="px-4 py-3">{(item as BusData).barangay}</td>
            <td className="px-4 py-3 flex items-center gap-2">
              <span>{item.hhId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(item.hhId)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy size={14} />
              </button>
            </td>
            <td className="px-4 py-3">{(item as BusData).granteeName}</td>
            <td className="px-4 py-3">{(item as BusData).typeOfUpdate}</td>
            <td className="px-4 py-3 max-w-xs truncate" title={(item as BusData).subjectOfChange}>
              {(item as BusData).subjectOfChange}
            </td>
          </>
        )}
        
        {activeDataType === 'SWDI' && (
          <>
            <td className="px-4 py-3 flex items-center gap-2">
              <span>{item.hhId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(item.hhId)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy size={14} />
              </button>
            </td>
            <td className="px-4 py-3">{(item as SwdiData).grantee}</td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 rounded text-xs font-medium">
                {(item as SwdiData).swdiScore}
              </span>
            </td>
          </>
        )}
        
        {activeDataType === 'PCN' && (
          <>
            <td className="px-4 py-3 flex items-center gap-2">
              <span>{item.hhId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(item.hhId)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy size={14} />
              </button>
            </td>
            <td className="px-4 py-3">{(item as PcnData).grantee}</td>
            <td className="px-4 py-3">{(item as PcnData).pcn || '-'}</td>
            <td className="px-4 py-3">{(item as PcnData).tr || '-'}</td>
          </>
        )}
        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded text-xs ${getEncodedBadgeClass(item.encoded)}`}>
            {item.encoded}
          </span>
        </td>
        <td className="px-4 py-3 max-w-xs truncate" title={item.issue || ''}>
          {item.issue || "No issues"}
        </td>
        <td className="px-4 py-3">
          {new Date(item.date).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => handleEdit(item.id)}
          >
            Load
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg text-black shadow-sm border border-gray-200 h-auto mt-4">
      <div className="p-6">
        {/* Data Type Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {(['BUS', 'SWDI', 'PCN'] as DataType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveDataType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeDataType === type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-black text-sm uppercase tracking-wide">
            {activeDataType} Data ({filteredData.length} records)
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                hasActiveFilters 
                  ? 'border-blue-300 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => currentRefetch()}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeDataType} records...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md border">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">Advanced Filters</h4>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Encoded Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Encoded Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.encoded}
                  onChange={(e) => handleFilterChange('encoded', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                  <option value="UPDATED">UPDATED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              {/* Username Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.username}
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                >
                  <option value="">All Users</option>
                  {uniqueUsernames.map(username => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm text-black rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {renderTableHeaders().map(header => (
                  <th key={header} className="px-4 py-3 text-left font-medium text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={renderTableHeaders().length} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={renderTableHeaders().length} className="px-4 py-8 text-center text-gray-500">
                    {currentData.length === 0 ? 'No data available' : 'No results match your filters'}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => renderTableRow(item, index))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 py-1 text-sm text-gray-500">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}