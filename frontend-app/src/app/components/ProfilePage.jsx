import { useEmotion } from '../contexts/EmotionContext';
import { useAuth } from '../contexts/AuthContext';
import { useEmotionTheme } from '../hooks/useEmotionTheme';
import { getUserStats, mockCourses } from '../data/mockData';
import { User, Mail, Calendar, Award, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export const ProfilePage = () => {
  const { emotion } = useEmotion();
  const { currentUser } = useAuth();
  const theme = useEmotionTheme(emotion);
  const stats = getUserStats();
  const enrolledCourses = mockCourses.filter(c => c.enrolled);

  const spacingClass = theme.spacing === 'compact' ? 'space-y-4' : theme.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
  const cardPaddingClass = theme.spacing === 'compact' ? 'p-4' : theme.spacing === 'relaxed' ? 'p-8' : 'p-6';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className={spacingClass}>
      {/* Profile Header */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <div className="flex items-start gap-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
              {currentUser?.name || 'User'}
            </h1>
            <div className={`space-y-2 ${theme.text} opacity-80`}>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{currentUser?.email || 'user@example.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${theme.cardBackground} ${cardPaddingClass}`}>
          <div className="flex items-center space-x-4">
            <div className={`${theme.accent} p-3 rounded-lg`}>
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Courses Enrolled</p>
              <p className={`text-2xl font-bold ${theme.text}`}>{stats.coursesEnrolled}</p>
            </div>
          </div>
        </Card>

        <Card className={`${theme.cardBackground} ${cardPaddingClass}`}>
          <div className="flex items-center space-x-4">
            <div className={`${theme.accent} p-3 rounded-lg`}>
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Completed</p>
              <p className={`text-2xl font-bold ${theme.text}`}>{stats.coursesCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className={`${theme.cardBackground} ${cardPaddingClass}`}>
          <div className="flex items-center space-x-4">
            <div className={`${theme.accent} p-3 rounded-lg`}>
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Hours Learned</p>
              <p className={`text-2xl font-bold ${theme.text}`}>{stats.totalHoursLearned}</p>
            </div>
          </div>
        </Card>

        <Card className={`${theme.cardBackground} ${cardPaddingClass}`}>
          <div className="flex items-center space-x-4">
            <div className={`${theme.accent} p-3 rounded-lg`}>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Current Streak</p>
              <p className={`text-2xl font-bold ${theme.text}`}>{stats.currentStreak} days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
          Learning Progress
        </h2>
        <div className={spacingClass}>
          {enrolledCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${theme.text} ${
                  theme.fontSize === 'large' ? 'text-lg' : ''
                }`}>
                  {course.title}
                </h3>
                <span className={`${theme.text} font-semibold`}>
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
              <div className={`text-sm ${theme.text} opacity-60`}>
                {course.lessons.filter(l => l.completed).length} / {course.lessons.length} lessons completed
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion History */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
          Learning Insights
        </h2>
        <div className={`${theme.text} opacity-80 space-y-4`}>
          <p>
            The platform has adapted to your emotional state <strong>{emotion}</strong> to optimize your learning experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Current Adaptations</h3>
              <ul className="text-sm space-y-1">
                <li>• Spacing: {theme.spacing}</li>
                <li>• Font size: {theme.fontSize}</li>
                <li>• Animations: {theme.animations ? 'Enabled' : 'Reduced'}</li>
                <li>• Theme: {emotion}</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Backend Integration</h3>
              <p className="text-sm">
                Connect your emotion detection backend API to enable automatic emotion tracking and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Integration Guide */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm border-2 border-dashed border-gray-300`}>
        <h2 className={`text-xl font-bold ${theme.text} mb-4`}>
          🔌 Backend Integration Points
        </h2>
        <div className={`${theme.text} opacity-80 space-y-3 text-sm`}>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">POST /api/detect-emotion</code>
            <p className="mt-1">Detect user emotion (called every 5 seconds when active)</p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">GET /api/courses</code>
            <p className="mt-1">Fetch all available courses</p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">GET /api/lessons/{'{lessonId}'}/content</code>
            <p className="mt-1">Load lesson content (video, text, quiz, etc.)</p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">POST /api/progress</code>
            <p className="mt-1">Update user progress and completion status</p>
          </div>
        </div>
      </div>
    </div>
  );
};