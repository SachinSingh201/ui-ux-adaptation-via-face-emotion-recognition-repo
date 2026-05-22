import { Link } from 'react-router';
import { useEmotion } from '../contexts/EmotionContext';
import { useEmotionTheme } from '../hooks/useEmotionTheme';
import { mockCourses, getUserStats } from '../data/mockData';
import { BookOpen, Clock, Award, Flame, ArrowRight } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Button } from './ui/button';

export const Dashboard = () => {
  const { emotion } = useEmotion();
  const theme = useEmotionTheme(emotion);
  const stats = getUserStats();
  const enrolledCourses = mockCourses.filter(c => c.enrolled);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    
    const emotionGreeting = {
      Boredom: 'You seem bored today. Perfect time to learn!',
      Engagement: 'Take it easy. Learning should be relaxing.',
      Confusion: 'Great energy! Let\'s make the most of it!',
      Frustration: 'You\'re in the zone. Time to deep dive!',
     
    };

    return {
      time: timeGreeting,
      emotion: emotionGreeting[emotion],
    };
  };

  const greeting = getGreeting();

  const spacingClass = theme.spacing === 'compact' ? 'space-y-4' : theme.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
  const cardPaddingClass = theme.spacing === 'compact' ? 'p-4' : theme.spacing === 'relaxed' ? 'p-8' : 'p-6';

  return (
    <div className={spacingClass}>
      {/* Greeting Section */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
          {greeting.time}! 👋
        </h1>
        <p className={`${theme.text} opacity-80`}>
          {greeting.emotion}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${theme.cardBackground} ${cardPaddingClass}`}>
          <div className="flex items-center space-x-4">
            <div className={`${theme.accent} p-3 rounded-lg`}>
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Enrolled</p>
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
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${theme.text} opacity-60`}>Day Streak</p>
              <p className={`text-2xl font-bold ${theme.text}`}>{stats.currentStreak}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme.text}`}>Continue Learning</h2>
          <Link to="/courses">
            <Button variant="ghost" className="flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.slice(0, 3).map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className={`${theme.cardBackground} overflow-hidden hover:shadow-lg transition-shadow ${
                theme.animations ? 'transition-all duration-300' : ''
              }`}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className={cardPaddingClass}>
                  <h3 className={`font-semibold mb-2 ${theme.text} ${
                    theme.fontSize === 'large' ? 'text-xl' : 'text-lg'
                  }`}>
                    {course.title}
                  </h3>
                  <p className={`text-sm ${theme.text} opacity-70 mb-4 line-clamp-2`}>
                    {course.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={`${theme.text} opacity-60`}>Progress</span>
                      <span className={`${theme.text} font-semibold`}>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended for your mood */}
      {emotion === 'Frustration' && (
        <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
          <h2 className={`text-xl font-bold ${theme.text} mb-4`}>
            💆 Recommended for Stress Relief
          </h2>
          <p className={`${theme.text} opacity-80 mb-4`}>
            We've adjusted the interface to be more calming. Consider taking shorter lessons or reviewing material you're already familiar with.
          </p>
          <Button className={theme.accent}>Browse Beginner Courses</Button>
        </div>
      )}

      {emotion === 'Engagement' && (
        <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
          <h2 className={`text-xl font-bold ${theme.text} mb-4`}>
            🎯 You're in Focus Mode
          </h2>
          <p className={`${theme.text} opacity-80 mb-4`}>
            Perfect time for challenging content! We've minimized distractions and optimized for deep learning.
          </p>
          <Link to="/courses">
            <Button className={theme.accent}>Tackle Advanced Topics</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
