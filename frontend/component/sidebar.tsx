import { Home, FileText, Settings, FileInput, LogOut, IdCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sidebar Navigation Component
type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    updateSidebarOption: (option: string) => void;
};

const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
    const navigate = useNavigate();
   const [activeItem, setActiveItem] = useState('dashboard');

   const updateSidebar = (option: string) => {
    setActiveItem(option);
    updateSidebarOption(option);
   }
   
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'busform', label: 'Bus Form', icon: FileText },
    { id: 'swdi', label: 'SWDI', icon: FileInput },
    { id: 'PCN', label: 'PCN', icon: IdCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar - Now sticks to left side */}
      <aside
        className={`
          fixed top-0 left-0 max-h-[100%] w-64 bg-gray-50 border-r border-gray-200 z-40 transform transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        {/* Add padding-top to account for header if needed */}
        <div className="pt-16 h-[100%] flex-1 overflow-y-auto">
          <div className="p-4 max-h-[100%">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => updateSidebar(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeItem === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer - Fixed at bottom */}
        <div className="border-t  border-gray-200 p-4 bg-gray-50">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Quick Links
          </div>
          <div className="space-y-1">
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-1">
              Help Center
            </a>
            <a href="#" className="block text-sm text-gray-600 hover:text-gray-800 px-3 py-1">
              Documentation
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;