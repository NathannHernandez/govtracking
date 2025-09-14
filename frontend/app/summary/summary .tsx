import { useQuery } from "@tanstack/react-query"
import BlankCalendar from "./monthlyEncoded"
import { useSelector } from "react-redux"
import type { RootState } from "redux/store"
import { Calendar, TrendingUp, FileText, Award, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

export type EncodedDocument = {
  id: number
  hhId: string
  name: string
  documentType: string
  documentId: number
  encoded: string
  userId: number
  username: string
  date: string
  createdAt: string
}

export type SummaryStats = {
  totalDocuments: number
  documentsByType: Record<string, number>
  documentsByStatus: Record<string, number>
  dailyStats: Array<{ date: string } & Record<string, Record<string, number> | number>>
}

export type TodaysSummary = {
  [documentType: string]: {
    [status: string]: number
  }
}

export default function EncodingSummary() {
  const user = useSelector((state: RootState) => state.user)
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear'>('thisMonth')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  const periodOptions = {
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    last3Months: 'Last 3 Months',
    thisYear: 'This Year'
  }

  function getPeriodDates(option: typeof selectedPeriod) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    switch (option) {
      case 'thisMonth':
        return `${year}-${month}`;
      case 'lastMonth': {
        const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return `${last.getFullYear()}-${(last.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      case 'last3Months': {
        const last3 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return `${last3.getFullYear()}-${(last3.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      case 'thisYear':
        return `${year}`;
      default:
        return `${year}-${month}`;
    }
  }

  function getTodaysDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  const { data: summaryData, isLoading } = useQuery<SummaryStats>({
    queryKey: ["encodingSummary", user.id, selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/monthlystats?id=${user.id}&month=${getPeriodDates(selectedPeriod)}`,{
                method: 'GET',
                credentials: 'include',
            })
      if (!res.ok) throw new Error("Error fetching summary data")
      return res.json()
    },
    enabled: !!user.id,
  })

  const { data: recentDocuments } = useQuery<EncodedDocument[]>({
    queryKey: ["recentDocuments", user.id, selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/recentmonthlystats?id=${user.id}&month=${getPeriodDates(selectedPeriod)}`,{
                method: 'GET',
                credentials: 'include',
            })
      if (!res.ok) throw new Error("Error fetching recent documents")
      return res.json()
    },
    enabled: !!user.id,
  })

  const { data: todaysSummary } = useQuery<TodaysSummary>({
    queryKey: ["todaysSummary", user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/recentmonthlystats?id=${user.id}&date=${getPeriodDates(selectedPeriod)}`,{
                method: 'GET',
                credentials: 'include',
            })
      if (!res.ok) throw new Error("Error fetching today's summary")
      return res.json()
    },
    enabled: !!user.id,
    refetchInterval: 5 * 60 * 1000,
  })

  useEffect(() => {
  }, [recentDocuments])

  const getDocumentTypes = (): string[] => {
    if (!summaryData) return []
    return Object.keys(summaryData.documentsByType || {})
  }

  const getDaysInMonth = (year: number, month: number) => {
    const days = new Date(year, month, 0).getDate()
    return Array.from({ length: days }, (_, i) => {
      const dateObj = new Date(year, month - 1, i + 1)
      return {
        day: i + 1,
        date: dateObj.toISOString().split('T')[0],
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: dateObj.toDateString() === new Date().toDateString(),
        isPast: dateObj < new Date(),
        isFuture: dateObj > new Date()
      }
    })
  }

  const dailyStats: Record<string, Record<string, Record<string, number>>> = {}
  summaryData?.dailyStats?.forEach(day => {
    const { date, ...rest } = day
    dailyStats[date] = rest as Record<string, Record<string, number>>
  })

  const dailyStatsByDate = summaryData?.dailyStats?.reduce((acc, day) => {
    let total = 0;
    if (typeof day.total === "number") {
      total = day.total;
    } else if (typeof day.total === "object" && day.total !== null) {
      total = Object.values(day.total).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);
    }
    acc[day.date] = { total };
    return acc;
  }, {} as Record<string, { total: number }>) || {}

  const totalPages = Math.ceil((recentDocuments?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = recentDocuments?.slice(startIndex, endIndex) || []

  useEffect(() => { setCurrentPage(1) }, [selectedPeriod])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'yes': case 'completed': case 'encoded': return 'bg-green-100 text-green-800'
      case 'no': case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'updated': return 'bg-blue-100 text-blue-800'
      case 'error': case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    color?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )
  const docTypes = getDocumentTypes();
  const dailyStatsMap = summaryData?.dailyStats?.reduce((acc, day) => {
    acc[day.date] = day;
    return acc;
  }, {} as Record<string, any>) || {};

  const period = getPeriodDates(selectedPeriod);
  const [year, month] = selectedPeriod === 'thisYear'
    ? [parseInt(period, 10), new Date().getMonth() + 1]
    : period.split('-').map(Number);

  const daysInMonth = getDaysInMonth(year, month);
  const monthTotals = docTypes.reduce((acc, docType) => {
    acc[docType] = Object.values(dailyStatsMap).reduce((sum, day) => {
      const typeData = day[docType] || {};
      return sum + Object.values(typeData).reduce((s: number, c) => s + (typeof c === "number" ? c : 0), 0);
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const overallMonthTotal = Object.values(monthTotals).reduce((sum, count) => sum + count, 0);



  const PaginationControls = () => (
    <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, recentDocuments?.length || 0)} of {recentDocuments?.length || 0} results
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 text-sm border rounded ${currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {pageNum}
              </button>
            )
          })}
          {totalPages > 5 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 text-sm border rounded ${currentPage === totalPages
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

  if (!user.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Please log in to view your encoding summary.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 text-black">
      {/* Header with Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
        <div className="px-6 py-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-700" />
          <h1 className="text-xl font-bold text-black">Encoding Summary</h1>
          <span className="text-gray-500 text-sm ml-2">- Track your document encoding progress and achievements</span>
        </div>
        <div className="relative" style={{ position: 'fixed', top: '80px', right: '40px', zIndex: 50 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Calendar size={16} />
            {periodOptions[selectedPeriod]}
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {Object.entries(periodOptions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPeriod(key as typeof selectedPeriod)
                    setDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${selectedPeriod === key ? "bg-blue-50 text-blue-600" : ""
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading summary data...</div>
        </div>
      ) : (
        <>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Documents"
              value={summaryData?.totalDocuments || 0}
              subtitle="Encoded documents"
              icon={FileText}
              color="blue"
            />

            <StatCard
              title="Completed"
              value={summaryData?.documentsByStatus?.['YES'] || summaryData?.documentsByStatus?.['                                         '] || 0}
              subtitle="Successfully encoded"
              icon={Award}
              color="green"
            />

            <StatCard
              title="Document Types"
              value={Object.keys(summaryData?.documentsByType || {}).length}
              subtitle="Different types processed"
              icon={TrendingUp}
              color="purple"
            />

            <StatCard
              title="Daily Average"
              value={summaryData?.dailyStats ?
                Math.round(summaryData.totalDocuments / Math.max(summaryData.dailyStats.length, 1)) : 0}
              subtitle="Documents per day"
              icon={Calendar}
              color="orange"
            />
          </div>



          {/* Document Types Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                Document Types
              </h3>
              <div className="space-y-3">
                {Object.entries(summaryData?.documentsByType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / (summaryData?.totalDocuments || 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                Status Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(summaryData?.documentsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / (summaryData?.totalDocuments || 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <BlankCalendar selectedPeriod={selectedPeriod} />

        </>
      )}
    </div>
  )
}