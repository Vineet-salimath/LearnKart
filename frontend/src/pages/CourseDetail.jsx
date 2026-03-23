import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../api/index';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { Loader, PageLoader } from '../components/common/Loader';
import { HelpCircle, Users, Clock, Award, Share2, Check } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const { addToCart, items: cartItems } = useCartStore();
  const { success, error } = useUIStore.getState();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await coursesAPI.getBySlug(slug);
        setCourse(data.data);

        if (isAuthenticated) {
          const { data: enrollData } = await enrollmentsAPI.check(data.data.id);
          setIsEnrolled(enrollData.data.isEnrolled);
        }
      } catch (err) {
        error('Failed to load course');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, isAuthenticated, navigate, success, error]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (course.price > 0) {
      addToCart(course);
      success('Course added to cart');
      navigate('/cart');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentsAPI.enroll(course.id);
      setIsEnrolled(true);
      success('Enrolled successfully!');
      setTimeout(() => navigate(`/learn/${course.id}`), 1000);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  const isInCart = cartItems.some(item => item.id === course.id);
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-purple-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                  {course.level}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-white opacity-90 mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users size={18} />
                  <span>{course.enrollmentCount || 0} Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={18} />
                  <span>Certificate Included</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="card bg-white shadow-lg p-6">
              <div className="mb-6">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  {formatPrice(course.discountPrice || course.price)}
                </div>
                {course.discountPrice && (
                  <div className="text-muted line-through">
                    {formatPrice(course.price)}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="w-full btn-primary"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
                >
                  {enrolling ? <Loader size="sm" /> : (
                    <>
                      {course.price > 0 ? 'Add to Cart' : 'Enroll Now'}
                    </>
                  )}
                </button>
              )}

              {!isEnrolled && isInCart && (
                <p className="text-green-600 text-center mt-2 text-sm">In your cart</p>
              )}

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Check size={16} className="text-green-600 mt-1" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check size={16} className="text-green-600 mt-1" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check size={16} className="text-green-600 mt-1" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            <section>
              <h2 className="font-heading text-3xl font-bold mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check size={20} className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-text">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="font-heading text-3xl font-bold mb-6">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-text">
                    <span className="text-primary font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Course Content */}
            <section>
              <h2 className="font-heading text-3xl font-bold mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.sections.map((section, idx) => (
                  <div key={idx} className="card p-6">
                    <h3 className="font-heading font-bold text-lg mb-4">{section.title}</h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-start space-x-3 text-muted">
                          {lesson.isFree ? (
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                              FREE
                            </span>
                          ) : (
                            <span className="text-lg">🔒</span>
                          )}
                          <span>{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor */}
            <section>
              <h2 className="font-heading text-3xl font-bold mb-6">About the Instructor</h2>
              <div className="card p-6 flex items-start space-x-6">
                <div className="w-20 h-20 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{course.instructor.name}</h3>
                  <p className="text-muted mt-2">{course.instructor.bio || 'Expert instructor'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
