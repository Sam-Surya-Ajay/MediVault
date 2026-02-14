import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Home, Calendar, MessageCircle, LogOut, Menu, X, Stethoscope } from "lucide-react";
import { userService, authService } from "@/lib/api";

const DoctorLayout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUserDetails();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: Home, current: currentPage === 'dashboard' },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar, current: currentPage === 'appointments' },
    { name: 'Chat', href: '/doctor/chat', icon: MessageCircle, current: currentPage === 'chat' },
  ];

  const handleLogout = () => {
    authService.logout();
    // Navigate back to home page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-green-600" />
              <span className="font-bold text-green-900">MediVault</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-green-100">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="bg-white shadow-lg border-r border-green-100 flex flex-col h-full">
          <div className="flex items-center space-x-2 p-6 border-b border-green-100">
            <Heart className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-900">MediVault</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-green-100 mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-green-900 capitalize">
                {currentPage === 'dashboard' ? 'Doctor Dashboard' : currentPage.replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                <div className="text-sm text-gray-600">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      Dr. <span className="font-medium text-green-700">{currentUser?.name || 'User'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
