import { useState } from 'react';
import { Link } from 'react-router';
import { useEmotion } from '../contexts/EmotionContext';
import { useEmotionTheme } from '../hooks/useEmotionTheme';
import { mockCourses } from '../data/mockData';
import { Search, Filter, Clock, BarChart } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const CoursesPage = () => {
  const { emotion } = useEmotion();
  const theme = useEmotionTheme(emotion);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'All' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const spacingClass = theme.spacing === 'compact' ? 'space-y-4' : theme.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
  const cardPaddingClass = theme.spacing === 'compact' ? 'p-4' : theme.spacing === 'relaxed' ? 'p-8' : 'p-6';

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={spacingClass}>
      {/* Header */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
          Explore Courses
        </h1>
        <p className={`${theme.text} opacity-80`}>
          Discover new skills and advance your career
        </p>
      </div>

      {/* Filters */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.text} opacity-40 h-5 w-5`} />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${
                theme.fontSize === 'large' ? 'text-lg py-6' : ''
              }`}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <Button
                key={level}
                variant={filterLevel === level ? 'default' : 'outline'}
                onClick={() => setFilterLevel(level)}
                className={`${
                  filterLevel === level ? theme.accent : ''
                }`}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`}>
            <Card className={`${theme.cardBackground} overflow-hidden hover:shadow-xl transition-shadow h-full ${
              theme.animations ? 'transition-all duration-300 hover:scale-105' : ''
            }`}>
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.enrolled && (
                  <Badge className="absolute top-3 right-3 bg-green-500">
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <div className={cardPaddingClass}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
                
                <h3 className={`font-semibold mb-2 ${theme.text} ${
                  theme.fontSize === 'large' ? 'text-xl' : 'text-lg'
                }`}>
                  {course.title}
                </h3>
                
                <p className={`text-sm ${theme.text} opacity-70 mb-4 line-clamp-2`}>
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 opacity-60" />
                    <span className={`${theme.text} opacity-60`}>{course.duration}</span>
                  </div>
                  <span className={`${theme.text} opacity-60`}>
                    by {course.instructor}
                  </span>
                </div>

                {course.enrolled && course.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`${theme.text} opacity-60`}>Progress</span>
                      <span className={`${theme.text} font-semibold`}>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${theme.accent} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm text-center`}>
          <p className={`${theme.text} opacity-60`}>
            No courses found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};
