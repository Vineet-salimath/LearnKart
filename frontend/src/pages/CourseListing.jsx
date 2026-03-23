import { useState, useEffect } from 'react';
import { coursesAPI } from '../api/index';
import { Loader } from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await coursesAPI.getAll(filters);
        setCourses(data.data.courses || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-bold mb-8">Explore Courses</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="font-heading font-bold text-lg mb-4">Filters</h3>

              <div className="mb-6">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="input-field"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
              </div>

              <div className="mb-6">
                <label className="form-label">Category</label>
                <select
                  className="input-field"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                >
                  <option value="">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="form-label">Level</label>
                <select
                  className="input-field"
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value, page: 1 })}
                >
                  <option value="">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <button
                className="w-full btn-primary"
                onClick={() => setFilters({ category: '', level: '', search: '', page: 1, limit: 12 })}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loader size="lg" />
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Link key={course.id} to={`/courses/${course.slug}`}>
                    <div className="card overflow-hidden hover:shadow-xl transition h-full">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {course.level}
                          </span>
                          <span className="text-xs text-muted">{course.language}</span>
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted mb-3">{course.instructor.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-lg text-primary">
                            {formatPrice(course.discountPrice || course.price)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">4.5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
