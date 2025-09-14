import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "redux/store"
import { setCurrentData, setNewData } from "redux/slice/bus/busSlice"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Copy } from "lucide-react"

type FormFields = {
  id: number
  userId: number
  username: string
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  typeOfUpdate: string
  encoded: string
  issue: string
  subjectOfChange: string
  date: string
}

export default function RecentTable() {
  const user = useSelector((state: RootState) => state.user)
  const busNewData = useSelector((state: RootState) => state.bus.newData)
  const dispatch = useDispatch<AppDispatch>()

  const { data: recentUpdates, isLoading, error, refetch } = useQuery<FormFields[]>({
    queryKey: ['recentBus', user.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/bus/recent?id=${user.id}`,{
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    enabled: !!user.id
  })

  const handleEdit = (id: number) => {
    const entryToEdit = recentUpdates?.find(entry => entry.id === id)
    if (!entryToEdit) return

    const { date, ...rest } = entryToEdit
    const dt = new Date(date)
    const formatted =
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}T` +
      `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`

    dispatch(setCurrentData({
      ...rest,
      date: formatted
    }))
  }

  useEffect(() => {
    if (busNewData) {
      refetch()
      dispatch(setNewData(false))
    }
  }, [busNewData])

  if (error) return <p>Error loading recent updates</p>

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto mt-4 flex-shrink-0">
      <div className="p-6">
        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
          Recent Updates
        </h3>
        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm text-black rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">LGU</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Barangay</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">HH ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Grantee Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Update Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Encoded</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Subject of Change</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : !recentUpdates || recentUpdates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    No recent updates
                  </td>
                </tr>
              ) : (
                recentUpdates.map((update, index) => (
                  <tr key={update.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">{update.lgu}</td>
                    <td className="px-4 py-3">{update.barangay}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span>{update.hhId}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(update.hhId)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        <Copy size={14} color="gray" />
                      </button>
                    </td>
                    <td className="px-4 py-3">{update.granteeName}</td>
                    <td className="px-4 py-3">{update.typeOfUpdate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${update.encoded === "YES" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {update.encoded}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={update.subjectOfChange}>
                      {update.subjectOfChange || "No subject"}
                    </td>
                    <td className="px-4 py-3">{new Date(update.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(update.id)}
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
