import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../redux/store';
import LoadingOverlay from './overlayLoading';
import SwdiRecent from './swdiRecent';
import { setNewData } from 'redux/slice/swdi/swdiSlice';


type SWDIFormFields = {
    username: string;
    hhId: string;
    grantee: string;
    swdiScore: string;
    encoded: string;
    issue: string;
    date: string;
    userId: number
};



function SWDIForm() {
    // Redux
    const User = useSelector((state: RootState) => state.user)
    const Swdi = useSelector((state: RootState) => state.swdi)
    const dispatch = useDispatch<AppDispatch>()

    const [formData, setFormData] = useState<SWDIFormFields>({
        userId: Number(User.id),
        username: User.name,
        hhId: '',
        grantee: '',
        swdiScore: '',
        encoded: '',
        issue: '',
        date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0]
    });


    useEffect(() => {
        if (!Swdi.currentSwdi) return
        const { id, createdAt, updatedAt, ...rest } = Swdi.currentSwdi
        setFormData(prev => ({
            ...prev,
            ...rest,   // update other fields
            date: prev.date // keep the date as-is
        }))
    }, [Swdi.currentSwdi])

        useEffect(() => {
            if (User.id && User.name) {
                setFormData(prev => ({
                    ...prev,
                    userId: Number(User.id),
                    username: User.name,
                }))
            }
        }, [User])
    



    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value.toUpperCase()
        }))
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // const { id, ...rest } = formData

        const payload = {
            ...formData,
            date: new Date(formData.date).toISOString()
        }

        const res = fetch('http://localhost:3001/v1/swdi/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await (await res).json();
        if (!(await res).ok) {
            console.error('Failed to submit SWDI form', data);
            return;
        }

        dispatch(setNewData(true))

        // Reset form after submission
        handleReset();
    }

    const handleReset = () => {
        setFormData({
            userId: Number(User.id),
            username: User.name,
            hhId: '',
            grantee: '',
            swdiScore: '',
            encoded: '',
            issue: '',
            date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0]
        });
    };


    if (User.loading) {
        return <LoadingOverlay />
    }

    return (
        <div className="max-h-screen overflow-y-auto">
            <div className="h-full max-w-full mx-auto flex flex-col">
                {/* Compact Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
                    <div className="px-6 py-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-bold text-black">SWDI ACCOMPLISHMENT TRACKING</h1>
                    </div>
                </div>



                {/* Main Form - Scrollable */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
                    <div className="overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Column 1 - Household Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Household Information</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="hhId" className="block text-xs font-medium text-black mb-1">
                                            HH ID <span className="text-red-500">*</span>
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
                                        <label htmlFor="grantee" className="block text-xs font-medium text-black mb-1">
                                            Grantee <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="grantee"
                                            name="grantee"
                                            value={formData.grantee}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                            placeholder="Enter Grantee Name"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 - Assessment Details */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Assessment Details</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="swdiScore" className="block text-xs font-medium text-black mb-1">
                                            SWDI Score <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="swdiScore"
                                            name="swdiScore"
                                            max={3}
                                            value={formData.swdiScore}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="encoded" className="block text-xs font-medium text-black mb-1">
                                            Encoded <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="encoded"
                                            name="encoded"
                                            required
                                            value={formData.encoded}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="YES">YES</option>
                                            <option value="NO">NO</option>
                                            <option value="UPDATED">UPDATED</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="date" className="block text-xs font-medium text-black mb-1">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            required
                                            disabled={true}
                                            value={formData.date}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Column 3 - Issues & Actions */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Issues & Actions</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="issue" className="block text-xs font-medium text-black mb-1">
                                            Issue
                                        </label>
                                        <textarea
                                            id="issue"
                                            name="issue"
                                            value={formData.issue}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                                            placeholder="Describe any issues or concerns..."
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
                <SwdiRecent />
            </div>
        </div>
    );
}

export default function SWDIMainContent() {
    return (
        <main className="p-6 h-full">
            <SWDIForm />
        </main>
    );
}