import { Edit, Trash2, Eye, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

export function CourseTable({ courses, onTogglePublish, onDelete, className }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-gray-200', className)}>
      <table className="w-full min-w-[1000px] border-collapse bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Course
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Instructor
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Status
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Price
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Students
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-right font-semibold text-text">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-12 w-20 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-text line-clamp-1">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted">{course.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={course.instructor?.avatar}
                      alt={course.instructor?.name}
                      fallback={course.instructor?.name}
                      size="sm"
                    />
                    <span className="text-muted">{course.instructor?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={course.isPublished ? 'success' : 'warning'}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">
                      {formatPrice(course.discountPrice || course.price)}
                    </p>
                    {course.discountPrice && (
                      <p className="text-xs text-muted line-through">
                        {formatPrice(course.price)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted" />
                    <span className="font-medium">
                      {course._count?.enrollments?.toLocaleString() || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/courses/${course.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" aria-label="View course">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onTogglePublish && onTogglePublish(course)}
                      aria-label={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete && onDelete(course)}
                      className="text-red-500 hover:bg-red-50"
                      aria-label="Delete course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-muted">
                No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
