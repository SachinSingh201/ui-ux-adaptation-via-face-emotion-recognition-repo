import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { EmotionProvider, useEmotion } from '../contexts/EmotionContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEmotionTheme } from '../hooks/useEmotionTheme';
import { Home, BookOpen, User, Smile, PlayCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { EmotionDetector } from './EmotionDetector';

const Navigation = () => {
  const { emotion } = useEmotion();
  const { currentUser, logout } = useAuth();
  const theme = useEmotionTheme(emotion);
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', protected: true },
    { path: '/courses', icon: BookOpen, label: 'Courses', protected: true },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className={`${isLandingPage ? 'bg-white' : theme.cardBackground} border-b border-gray-200 sticky top-0 z-50 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <PlayCircle className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-semibold ${isLandingPage ? 'text-gray-900' : theme.text}`}>
              EduMotion
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              // Hide protected items if not logged in
              if (item.protected && !currentUser) return null;
              
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    active && !isLandingPage
                      ? `${theme.accent} text-white`
                      : `${isLandingPage ? 'text-gray-700 hover:text-gray-900' : theme.text} hover:bg-gray-100`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {currentUser ? (
              <div className="flex items-center space-x-4 pl-4 border-l">
                <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l">
                <Link to="/login">
                  <button className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {!isLandingPage && currentUser && <EmotionDetector />}
          </div>
        </div>
      </div>
    </nav>
  );
};

const LayoutContent = () => {
  const { emotion } = useEmotion();
  const theme = useEmotionTheme(emotion);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`min-h-screen ${isAuthPage ? 'bg-white' : theme.background} transition-colors duration-500`}>
      <Navigation />
      <main className={`${isAuthPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export const RootLayout = () => {
  return (
    <AuthProvider>
      <EmotionProvider>
        <LayoutContent />
      </EmotionProvider>
    </AuthProvider>
  );
};