import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { adminAPI } from '../api/index';
import { PageLoader } from '../components/common/Loader';
import { Users, BookOpen, ShoppingCart, Percent, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponMaxUses, setCouponMaxUses] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, usersData, coursesData, ordersData, couponsData] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
          adminAPI.getCourses(),
          adminAPI.getOrders(),
          adminAPI.getCoupons()
        ]);
        setStats(statsData.data.data || {});
        setUsers(usersData.data.data || []);
        setCourses(coursesData.data.data || []);
        setOrders(ordersData.data.data || []);
        setCoupons(couponsData.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCoupon({
        code: couponCode,
        discountPercent: parseInt(couponDiscount),
        maxUses: parseInt(couponMaxUses)
      });
      setCouponCode('');
      setCouponDiscount('');
      setCouponMaxUses('');
      const res = await adminAPI.getCoupons();
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await adminAPI.deleteCoupon(couponId);
      const res = await adminAPI.getCoupons();
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold mb-12">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Users</p>
                <p className="text-3xl font-bold font-heading">{stats.totalUsers}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Courses</p>
                <p className="text-3xl font-bold font-heading">{stats.totalCourses}</p>
              </div>
              <BookOpen className="text-secondary" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Orders</p>
                <p className="text-3xl font-bold font-heading">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="text-accent" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Total Revenue</p>
                <p className="text-3xl font-bold font-heading">₹{stats.totalRevenue}</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto">
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none whitespace-nowrap">
              Users
            </Tab>
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none whitespace-nowrap">
              Courses
            </Tab>
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none whitespace-nowrap">
              Orders
            </Tab>
            <Tab className="text-text font-heading font-bold px-4 py-2 border-b-2 border-transparent hover:border-primary transition focus:outline-none whitespace-nowrap">
              Coupons
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Users Tab */}
            <Tab.Panel>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 font-heading font-bold">{user.name || user.email.split('@')[0]}</td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                              user.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>

            {/* Courses Tab */}
            <Tab.Panel>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Course</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Instructor</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Students</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 font-heading font-bold line-clamp-1">{course.title}</td>
                          <td className="px-6 py-4 text-sm">{course.instructor?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm">{course._count?.enrollments || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>

            {/* Orders Tab */}
            <Tab.Panel>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Order ID</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Student</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-muted">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                          <td className="px-6 py-4 text-sm">{order.user?.email}</td>
                          <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>

            {/* Coupons Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Create Coupon Form */}
                <div className="card p-6">
                  <h3 className="font-heading font-bold text-lg mb-4">Create New Coupon</h3>
                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        required
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Discount %"
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        required
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Max Uses"
                        value={couponMaxUses}
                        onChange={(e) => setCouponMaxUses(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <button type="submit" className="btn-primary">
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* Coupons Table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-3 text-left text-sm font-bold text-muted">Code</th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-muted">Discount</th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-muted">Usage</th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-muted">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-muted">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon) => (
                          <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono font-bold">{coupon.code}</td>
                            <td className="px-6 py-4">{coupon.discountPercent}%</td>
                            <td className="px-6 py-4 text-sm">{coupon.usedCount}/{coupon.maxUses}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {coupon.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="text-accent hover:text-red-700 transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default AdminDashboard;
