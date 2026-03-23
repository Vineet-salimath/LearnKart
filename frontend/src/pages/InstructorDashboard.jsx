import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/index';
import { PageLoader } from '../components/common/Loader';
import { Plus, BarChart3, Users, TrendingUp } from 'lucide-react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, students: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, statsData] = await Promise.all([
          coursesAPI.getMyCourses(),
          coursesAPI.getStats?.()
        ]);
        setCourses(courseData.data.data || []);
        if (statsData) setStats(statsData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-4xl font-bold">Instructor Dashboard</h1>
          <Link to="/instructor/courses/new" className="btn-primary">
            <Plus size={20} /> Create Course
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Revenue</p>
                <p className="text-3xl font-bold font-heading">₹{stats.revenue || 0}</p>
              </div>
              <TrendingUp className="text-secondary" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Students</p>
                <p className="text-3xl font-bold font-heading">{stats.students || 0}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Courses</p>
                <p className="text-3xl font-bold font-heading">{courses.length}</p>
              </div>
              <BarChart3 className="text-accent" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Avg Rating</p>
                <p className="text-3xl font-bold font-heading">5.0</p>
              </div>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-heading font-bold text-xl">My Courses</h2>
          </div>

          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-bold text-muted">Course</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-muted">Students</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-muted">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-heading font-bold">{course.title}</td>
                      <td className="px-6 py-4 text-sm">{course._count?.enrollments || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            course.isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/instructor/courses/${course.id}/edit`}
                          className="text-primary hover:underline text-sm font-bold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-muted text-center">No courses yet. Create your first course!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
