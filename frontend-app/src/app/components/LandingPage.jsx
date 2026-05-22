import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const LandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Learn Smarter with EduMotion
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
            Experience adaptive learning powered by real-time engagement tracking. 
            Our AI monitors your focus and adjusts content to maximize your learning potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <>
                <Link to="/courses">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-white text-lg px-8 py-6 h-auto"
                  >
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 h-auto"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-white text-lg px-8 py-6 h-auto"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 h-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none p-8 text-center">
            <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Tracking</h3>
            <p className="text-gray-600">
              AI monitors your engagement in real-time
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none p-8 text-center">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Adaptive Content</h3>
            <p className="text-gray-600">
              Lessons adjust to your focus level
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none p-8 text-center">
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Better Results</h3>
            <p className="text-gray-600">
              Learn faster with personalized pacing
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};