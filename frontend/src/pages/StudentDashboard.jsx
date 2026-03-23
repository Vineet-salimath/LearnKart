import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { enrollmentsAPI, paymentsAPI } from '../api/index';
import { Loader, PageLoader } from '../components/common/Loader';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag } from 'lucide-react';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrollData, orderData] = await Promise.all([
          enrollmentsAPI.getMy(),
          paymentsAPI.getOrders()
        ]);
        setEnrolledCourses(enrollData.data.data || []);
        setOrders(orderData.data.data || []);
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
        <h1 className="font-heading text-4xl font-bold mb-12">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-primary" size={32} />
              <div>
                <p className="text-muted text-sm">Courses Enrolled</p>
                <p className="text-3xl font-heading font-bold">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="text-secondary" size={32} />
              <div>
                <p className="text-muted text-sm">Total Courses Purchased</p>
                <p className="text-3xl font-heading font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b border-gray-200 mb-8">
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none">
              My Learning
            </Tab>
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none">
              My Orders
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment) => (
                    <Link
                      key={enrollment.id}
                      to={`/learn/${enrollment.course.id}`}
                      className="card overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-heading font-bold line-clamp-2 mb-2">
                          {enrollment.course.title}
                        </h3>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted">{enrollment.progress}% complete</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-12">No courses yet. Start learning!</p>
              )}
            </Tab.Panel>

            <Tab.Panel>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-heading font-bold">{order.items.length} course(s)</p>
                          <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{order.totalAmount}</p>
                          <p className="text-sm text-green-600">✓ {order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-12">No orders yet</p>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default StudentDashboard;
