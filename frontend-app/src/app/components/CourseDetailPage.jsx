import { Link, useParams } from 'react-router';
import { useEmotion } from '../contexts/EmotionContext';
import { useEmotionTheme } from '../hooks/useEmotionTheme';
import { mockCourses } from '../data/mockData';
import { ArrowLeft, Clock, BarChart, CheckCircle2, Circle, PlayCircle, BookOpen, FileText, Brain } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { emotion } = useEmotion();
  const theme = useEmotionTheme(emotion);

  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className={`${theme.cardBackground} rounded-xl p-8 shadow-sm text-center`}>
        <p className={`${theme.text}`}>Course not found</p>
        <Link to="/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const spacingClass = theme.spacing === 'compact' ? 'space-y-4' : theme.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
  const cardPaddingClass = theme.spacing === 'compact' ? 'p-4' : theme.spacing === 'relaxed' ? 'p-8' : 'p-6';

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'reading':
        return BookOpen;
      case 'quiz':
        return Brain;
      case 'practice':
        return FileText;
      default:
        return Circle;
    }
  };

  const completedLessons = course.lessons.filter(l => l.completed).length;
  const totalLessons = course.lessons.length;

  return (
    <div className={spacingClass}>
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Button>
      </Link>

      {/* Course Header */}
      <div className={`${theme.cardBackground} rounded-xl overflow-hidden shadow-sm`}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className={cardPaddingClass}>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800">
              {course.level}
            </Badge>
            {course.enrolled && (
              <Badge className="bg-green-500">Enrolled</Badge>
            )}
          </div>

          <h1 className={`text-3xl font-bold ${theme.text} mb-4`}>
            {course.title}
          </h1>

          <p className={`${theme.text} opacity-80 mb-6 ${
            theme.fontSize === 'large' ? 'text-lg' : ''
          }`}>
            {course.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 opacity-60" />
              <span className={`${theme.text} opacity-80`}>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 opacity-60" />
              <span className={`${theme.text} opacity-80`}>{course.level}</span>
            </div>
            <div className={`${theme.text} opacity-80`}>
              Instructor: {course.instructor}
            </div>
          </div>

          {course.enrolled && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className={`${theme.text} opacity-60`}>Course Progress</span>
                <span className={`${theme.text} font-semibold`}>
                  {completedLessons} / {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>
          )}

          {!course.enrolled && (
            <Button className={`${theme.accent} text-white px-8 py-6 text-lg`}>
              Enroll in Course
            </Button>
          )}
        </div>
      </div>

      {/* Lessons List */}
      <div className={`${theme.cardBackground} rounded-xl ${cardPaddingClass} shadow-sm`}>
        <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
          Course Content
        </h2>

        <div className={spacingClass}>
          {course.lessons.map((lesson, index) => {
            const LessonIcon = getLessonIcon(lesson.type);
            return (
              <Link
                key={lesson.id}
                to={course.enrolled ? `/courses/${courseId}/lessons/${lesson.id}` : '#'}
                className={!course.enrolled ? 'pointer-events-none' : ''}
              >
                <Card className={`${theme.cardBackground} border ${
                  lesson.completed ? 'border-green-500' : 'border-gray-200'
                } hover:shadow-md transition-shadow ${
                  theme.animations ? 'transition-all duration-300' : ''
                } ${!course.enrolled ? 'opacity-50' : ''}`}>
                  <div className={`${cardPaddingClass} flex items-center justify-between`}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`${
                        lesson.completed ? 'bg-green-500' : theme.accent
                      } p-3 rounded-lg`}>
                        {lesson.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                          <LessonIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${theme.text} opacity-60`}>
                            Lesson {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                        </div>
                        <h3 className={`font-semibold ${theme.text} mb-1 ${
                          theme.fontSize === 'large' ? 'text-lg' : ''
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className={`text-sm ${theme.text} opacity-70`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`text-sm ${theme.text} opacity-60`}>
                        {lesson.duration}
                      </span>
                      {lesson.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {!course.enrolled && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className={`${theme.text} text-center`}>
              Enroll in this course to access all lessons
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
