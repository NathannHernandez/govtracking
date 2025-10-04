import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "redux/store";
import { Check, Upload, Save, RefreshCw, X } from "lucide-react";

export default function ImportData() {
    const [fileType, setFileType] = useState("bus");
    const [file, setFile] = useState<File | null>(null);
    const currentUser = useSelector((state: RootState) => state.user);
    const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' | 'error' }>({});
    const [importError, setImportError] = useState<string>('');
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
        else setFile(null);
    };

    const SaveButton = ({ section, onClick }: { section: string, onClick: () => void }) => {
        const status = saveStatus[section] || 'idle';
        return (
            <button
                onClick={onClick}
                disabled={status === 'saving'}
                className={`px-4 py-2 rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors ${status === 'saved'
                    ? 'bg-green-600 text-white'
                    : status === 'saving'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                {status === 'saving' ? (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                    </>
                ) : status === 'saved' ? (
                    <>
                        <Check className="w-4 h-4" />
                        Saved!
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Save
                    </>
                )}
            </button>
        );
    };

    const handleUpload = async () => {
        if (!file) return;
        setSaveStatus({ ...saveStatus, import: 'saving' });
        setImportError('');
        setImportErrors([]);
        setShowErrorModal(false);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', String(currentUser.id));
        formData.append('username', currentUser.name);

        try {
            const response = await fetch(`http://localhost:3001/v1/setting/cvs-upload-${fileType}`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                setSaveStatus({ ...saveStatus, import: 'error' });
                setImportError('Upload failed');
                return;
            }

            const result = await response.json();

            if (result.success) {
                setSaveStatus({ ...saveStatus, import: 'saved' });
                setFile(null);
            } else {
                setSaveStatus({ ...saveStatus, import: 'error' });
                if (result.errors && Array.isArray(result.errors)) {
                    setImportErrors(result.errors);
                    setShowErrorModal(true);
                } else if (result.message) {
                    setImportError(result.message);
                } else {
                    setImportError('Import failed');
                }
            }
        } catch (err) {
            console.error('Fetch error', err);
            setSaveStatus({ ...saveStatus, import: 'error' });
            setImportError('Fetch error');
        }

        setTimeout(() => {
            setSaveStatus({ ...saveStatus, import: 'idle' });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-black mb-1">
                        Data Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                        <option value="bus">Bus Records</option>
                        <option value="swdi">SWDI Data</option>
                        <option value="pcn">PCN Records</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-black mb-1">
                        Select File <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    />
                </div>

                {file && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center space-x-3">
                            <Upload className="w-4 h-4 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">{file.name}</p>
                                <p className="text-xs text-blue-700">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {fileType.toUpperCase()} format
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {importError && <h1 className="text-red-600 text-sm">{importError}</h1>}

                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <h4 className="text-xs font-medium text-black mb-2">Import Guidelines</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Ensure CSV file has proper headers</li>
                        <li>• Data should be clean and formatted</li>
                        <li>• Large files may take time to process</li>
                        <li>• Duplicate records will be skipped</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <SaveButton section="import" onClick={handleUpload} />
            </div>
            {showErrorModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-96 max-w-full p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-sm text-black">Import Errors</h4>

                        </div>
                        <ul className="text-xs text-red-600 max-h-64 overflow-y-auto space-y-2 pl-2">
                            {importErrors.map((err, i) => (
                                <li key={i} className="list-disc">{err}</li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}
