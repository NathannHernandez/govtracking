import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';

type FormFields = {
  id: number;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  encoded: string;
  issue: string;
  subjectOfChange: string;
  dateAccomplished: string;
};

// Keyboard navigation mappings
const UPDATE_TYPE_KEYMAP = {
  '1': 'New Registration',
  '2': 'Profile Update',
  '3': 'Status Change',
  '4': 'Address Change',
  '5': 'Contact Update',
  '6': 'Other'
};

const ENCODED_KEYMAP = {
  'y': 'YES',
  'Y': 'YES',
  'n': 'No',
  'N': 'No'
};

const ISSUE_KEYMAP = {
  '1': 'No Issue',
  '2': 'Missing Documents',
  '3': 'Invalid Information',
  '4': 'Duplicate Entry',
  '5': 'System Error',
  '6': 'Other'
};

function BusForm() {
  const [formData, setFormData] = useState<FormFields>({
    id: 0,
    lgu: '',
    barangay: '',
    hhId: '',
    granteeName: '',
    typeOfUpdate: '',
    encoded: '',
    issue: '',
    subjectOfChange: '',
    dateAccomplished: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0] // Default to today's date in YYYY-MM-DD format;
  });

  const [newUpdatedEntry, setNewUpdatedEntry] = useState<number>(0);

  const [recentUpdates, setRecentUpdates] = useState<FormFields[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const dateFormatToISO = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }

  useEffect(() => {
    const getRecentUpdates = fetch('http://localhost:3001/v1/bus', {
      method: 'GET',
      credentials: 'include'
    });
    getRecentUpdates.then(async res => {
      if (res.ok) {
        const data = await res.json();
        setRecentUpdates(data.slice(-3).reverse()); // Keep only last 3 entries
      } else {
        console.error('Failed to fetch recent updates');
      }
    }).catch(err => {
      console.error('Network error while fetching recent updates', err);
    }
    );


  }, [newUpdatedEntry]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { id, ...rest } = formData

    const payload = {
      ...rest,
      dateAccomplished: new Date(formData.dateAccomplished).toISOString()
    }


    // Add to recent updates (keep only last 3)
    // setRecentUpdates(prev => {
    //   const newUpdates = [formData, ...prev];
    //   return newUpdates.slice(0, 3);
    // });

    const res = fetch('http://localhost:3001/v1/bus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await (await res).json();
    if (!(await res).ok) {
      console.error('Failed to submit form', data);
      return;
    }
    setNewUpdatedEntry(data.id);

    console.log('Form submitted:', payload)

    // Reset form after submission
    handleReset();
  }

  const handleReset = () => {
    setFormData({
      id: 0,
      lgu: '',
      barangay: '',
      hhId: '',
      granteeName: '',
      typeOfUpdate: '',
      encoded: '',
      issue: '',
      subjectOfChange: '',
      dateAccomplished: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0]
    });
  };

  const handleUpdateTypeKeyDown = (e: React.KeyboardEvent) => {
    const mappedValue = UPDATE_TYPE_KEYMAP[e.key as keyof typeof UPDATE_TYPE_KEYMAP];
    if (mappedValue) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        typeOfUpdate: mappedValue
      }));
    }
  };

  const handleEncodedKeyDown = (e: React.KeyboardEvent) => {
    const mappedValue = ENCODED_KEYMAP[e.key as keyof typeof ENCODED_KEYMAP];
    if (mappedValue) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        encoded: mappedValue
      }));
    }
  };

  const handleEdit = (id: number) => {
    const entryToEdit = recentUpdates.find(entry => (entry as any).id === id)
    if (entryToEdit) {
      const { dateAccomplished, ...rest } = entryToEdit
      setFormData({
        ...rest,
        dateAccomplished: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0] // Default to today's date in YYYY-MM-DD format;

      })
    }
  }



  const updateTypeOptions = [
    'New Registration',
    'Profile Update',
    'Status Change',
    'Address Change',
    'Contact Update',
    'Other'
  ];


  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="h-full max-w-full mx-auto flex flex-col">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
          <div className="px-6 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-700" />
            <h1 className="text-xl font-bold text-black">BUS ACCOMPLISHMENT TRACKING</h1>
            <span className="text-gray-500 text-sm ml-2">- Household Information Form</span>
          </div>
        </div>

        {/* Recent Updates Table */}
        {recentUpdates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
            <div className="p-6">
              <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">Recent Updates</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">LGU</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Barangay</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">HH ID</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Grantee Name</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Update Type</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Encoded</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Subject of Change</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUpdates.map((update, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.lgu}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.barangay}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.hhId}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.granteeName}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.typeOfUpdate}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${update.encoded === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {update.encoded}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-800 border-b">{update.subjectOfChange}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">{new Date(update.dateAccomplished).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-gray-800 border-b">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => handleEdit(update.id)}
                          >
                            Load
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Main Form - Scrollable */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Column 1 - Location & Household */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Basic Information</h3>

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
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Update Details</h3>

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
                      onKeyDown={handleUpdateTypeKeyDown}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                      <option value="">Select Type</option>
                      {updateTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
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
                      onKeyDown={handleEncodedKeyDown}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                      <option value="">Select</option>
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
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
                    <label htmlFor="dateAccomplished" className="block text-xs font-medium text-black mb-1">
                      Date Accomplished
                    </label>
                    <input
                      type="date"
                      id="dateAccomplished"
                      name="dateAccomplished"
                      required
                      disabled={true}
                      value={formData.dateAccomplished}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3 - Remarks & Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Additional Info</h3>

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
                      rows={8}
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

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">&copy; 2025 LGU Data Entry System</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MainContent() {
  return (
    <main className="p-6 h-full">
      <BusForm />
    </main>
  );
}