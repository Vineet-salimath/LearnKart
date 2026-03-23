import Link from 'next/link';
import { BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  lesson_count: number;
  enrollment_count: number;
}

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export default function CourseCard({ course, isEnrolled = false }: CourseCardProps) {
  const levelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  };

  const getLevelColor = (level: string) => {
    return levelColors[level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800';
  };

  const estimatedDuration = course.lesson_count * 45; // minutes
  const durationText = estimatedDuration >= 60 
    ? `${Math.floor(estimatedDuration / 60)}h ${estimatedDuration % 60}m`
    : `${estimatedDuration}m`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Course Image/Gradient */}
      <div className="h-48 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Enrolled
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="text-sm text-gray-500 mb-4">
          <p className="font-medium">Instructor: {course.instructor}</p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.lesson_count} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{durationText}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrollment_count}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">4.8 (127 reviews)</span>
        </div>

        {/* Action Button */}
        <Link
          href={`/courses/${course.id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center group transition-colors duration-200"
        >
          <span>{isEnrolled ? 'Continue Learning' : 'View Course'}</span>
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}