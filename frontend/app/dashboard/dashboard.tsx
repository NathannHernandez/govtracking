import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import TopNavbar from "../../component/navigation";
import Sidebar from "../../component/sidebar";
import BusForm from "./busForm";
import MainPage from "./main";

export default function Dashboard() {
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarOption, setSidebarOption] = useState('dashboard');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const updateSidebarOption = (option: string) => {
        setSidebarOption(option);
        if (option === 'logout') {
            handleLogout();
        }
    }

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3001/v1/auth/logout", {
                method: "GET",
                credentials: "include", // ensures cookies are sent
            });
            if (res.ok) {
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Network error during logout", err);
        }
    };

    return (
       <main className="flex min-h-screen justify-center items-center bg-gray-100">
    <div className="h-[100%] bg-gray-100 w-full">
        {/* Top Navigation */}
        <TopNavbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Layout Container */}
        <div className="flex pt-16 relative h-[100%]">
            {/* Sidebar */}
            <Sidebar 
                updateSidebarOption={updateSidebarOption} 
                isOpen={isSidebarOpen} 
                onClose={closeSidebar} 
            />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 h-full ${
                isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
            } w-full`}>
                {sidebarOption === 'dashboard' && <MainPage />} 
                {sidebarOption === 'busform' && <BusForm />}
            </div>
        </div>
    </div>
</main>
    )
}




// Main Content Component
const MainContent = () => {
    return (
        <main className="p-6 max-h-[90%] overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome to your dashboard wireframe</p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="w-full h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                            <span className="text-gray-500">Content Block {item}</span>
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">Card Title</h3>
                        <p className="text-sm text-gray-600">
                            This is a placeholder for content. Replace with your actual content.
                        </p>
                    </div>
                ))}
            </div>

            {/* Additional Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center space-x-3 py-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs text-blue-600">{item}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">Activity item {item}</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};


