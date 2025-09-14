import React, { useEffect, useState } from 'react'
import { Save, RefreshCw, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../redux/store'
import LoadingOverlay from './busLoading'
import { fetchRecentBus } from 'redux/thunks/busThunks'
import RecentTable from './busRecent'
import { setNewData } from 'redux/slice/bus/busSlice'

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
  createdAt?: string
  updatedAt?: string
}

const UPDATE_TYPE_KEYMAP: Record<string, string> = {
  '1': 'New Registration',
  '2': 'Profile Update',
  '3': 'Status Change',
  '4': 'Address Change',
  '5': 'SCHOOL UPDATE',
  '6': 'GRANTE UPDATE',
  '7': 'DECEASE Update',
  '9': 'BASIC INFO UPDATE',
  '10': 'UNKNOWN',
  '11': 'BENEFICIARY UPDATE',
  '12': 'PREGNANCY UPDATE',
};


const ISSUE_KEYMAP = {
  '1': 'No Issue',
  '2': 'Missing Documents',
  '3': 'Invalid Information',
  '4': 'Duplicate Entry',
  '5': 'System Error',
  '6': 'Other'
}

function BusForm() {
  const dispatch = useDispatch<AppDispatch>()
  const User = useSelector((state: RootState) => state.user)
  const recentBus = useSelector((state: RootState) => state.bus.recentBus)
  const currentBusForm = useSelector((state: RootState) => state.bus.currentData)

  const updateTypeOptions = [
    'New Registration',
    'Profile Update',
    'Status Change',
    'Address Change',
    'Contact Update',
    'Other'
  ]

  const [formData, setFormData] = useState<FormFields>({
    id: 0,
    userId: Number(User.id),
    username: User.name,
    lgu: '',
    barangay: '',
    hhId: '',
    granteeName: '',
    typeOfUpdate: '',
    encoded: '',
    issue: '',
    subjectOfChange: '',
    date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`

  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }))
  }

  useEffect(() => {
    if (!currentBusForm) return
    const { date, ...rest } = currentBusForm
    setFormData(prev => ({
      ...prev,
      ...rest,   // update other fields
      date: prev.date // keep the date as-is
    }))
  }, [currentBusForm])

  useEffect(() => {
    if (!User || !User.id) return
    setFormData(prev => ({
      ...prev,
      userId: Number(User.id),
      username: User.name
    }))
  }, [User])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { createdAt, updatedAt, id, ...rest } = formData

    const payload = {
      ...rest,
      date: new Date(formData.date).toISOString()
    }

    console.log(payload, ' PAY LOADS')

    const res = fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/bus/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    const data = await (await res).json()
    if (!(await res).ok) {
      console.error('Failed to submit form', data)
      return
    }

    dispatch(setNewData(true))
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      id: 0,
      userId: Number(User.id),
      username: User.name,
      lgu: '',
      barangay: '',
      hhId: '',
      granteeName: '',
      typeOfUpdate: '',
      encoded: '',
      issue: '',
      subjectOfChange: '',
      date: new Date(
        Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      )
        .toISOString()
        .split('T')[0]
    })
  }



  if (User.id === '0') return <LoadingOverlay />

  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="h-full max-w-full mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
          <div className="px-6 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-700" />
            <h1 className="text-xl font-bold text-black">BUS ACCOMPLISHMENT TRACKING</h1>
            <span className="text-gray-500 text-sm ml-2">- Household Information Form</span>
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Column 1 - Location & Household */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="lgu" className="block text-xs font-medium text-black mb-1">
                      LGU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lgu"
                      name="lgu"
                      value={formData.lgu}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter LGU"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="barangay" className="block text-xs font-medium text-black mb-1">
                      Barangay <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="barangay"
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Barangay"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="hhId" className="block text-xs font-medium text-black mb-1">
                      HH ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="hhId"
                      name="hhId"
                      value={formData.hhId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter HH ID"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="granteeName" className="block text-xs font-medium text-black mb-1">
                      Grantee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="granteeName"
                      name="granteeName"
                      value={formData.granteeName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 - Update & Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Update Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="typeOfUpdate" className="block text-xs font-medium text-black mb-1">
                      Type of Update <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="typeOfUpdate"
                      name="typeOfUpdate"
                      value={formData.typeOfUpdate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                      <option value="">Select Type</option>
                      {Object.entries(UPDATE_TYPE_KEYMAP).map(([key, value]) => (
                        <option key={key} value={key}>
                          {key} - {value}  {/* Put the number first so typing '1' works */}
                        </option>
                      ))}
                    </select>


                  </div>

                  <div>
                    <label htmlFor="encoded" className="block text-xs font-medium text-black mb-1">
                      Encoded Y/N <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="encoded"
                      name="encoded"
                      required
                      value={formData.encoded}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                      <option value="">Select</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                      <option value="UPDATED">UPDATED</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subjectOfChange" className="block text-xs font-medium text-black mb-1">
                      Subject of Change <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subjectOfChange"
                      name="subjectOfChange"
                      value={formData.subjectOfChange}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-xs font-medium text-black mb-1">
                      Date Accomplished
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      disabled
                      value={formData.date}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3 - Remarks & Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Additional Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="issue" className="block text-xs font-medium text-black mb-1">
                      Issues
                    </label>
                    <textarea
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                      placeholder="Enter remarks..."
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <button
                      type="submit"
                      className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Save size={16} />
                      Submit Form
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full bg-gray-200 text-black px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <RecentTable />
      </div>
    </div>
  )
}

export default function MainContent() {
  return (
    <main className="p-6 h-full">
      <BusForm />
    </main>
  )
}
