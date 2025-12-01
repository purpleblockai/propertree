/**
 * Admin Dashboard - Overview with KPIs and Analytics
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Users, Calendar, DollarSign, 
  TrendingUp, Clock, CheckCircle, XCircle, 
  BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Container } from '../../components/layout';
import { Card, Loading } from '../../components/common';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchAnalytics();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard/stats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/dashboard/analytics/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of platform statistics and pending actions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Properties */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.properties.total || 0}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  +{stats?.properties.recent || 0} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-propertree-blue" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Users */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.users.total || 0}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  +{stats?.users.recent || 0} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Bookings */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.bookings.total || 0}
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  +{stats?.bookings.recent || 0} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Revenue */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${stats?.revenue.total.toFixed(0) || 0}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  ${stats?.revenue.monthly.toFixed(0) || 0} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Property Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Status */}
        <Card>
          <Card.Header>
            <Card.Title>Property Status</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {/* Pending */}
              <Link 
                to="/admin/properties?status=pending_approval"
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Pending Approval</p>
                    <p className="text-sm text-gray-600">Requires your review</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats?.properties.pending || 0}
                </span>
              </Link>

              {/* Active */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Active</p>
                    <p className="text-sm text-gray-600">Live on platform</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.properties.active || 0}
                </span>
              </div>

              {/* Rejected */}
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Rejected</p>
                    <p className="text-sm text-gray-600">Not approved</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {stats?.properties.rejected || 0}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* User Breakdown */}
        <Card>
          <Card.Header>
            <Card.Title>User Breakdown</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-6">
              {/* Landlords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Landlords</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.users.landlords || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-propertree-blue h-2 rounded-full transition-all"
                    style={{
                      width: `${stats?.users.total > 0 ? (stats.users.landlords / stats.users.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.users.total > 0 
                    ? ((stats.users.landlords / stats.users.total) * 100).toFixed(1) 
                    : 0}% of total users
                </p>
              </div>

              {/* Tenants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tenants</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.users.tenants || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${stats?.users.total > 0 ? (stats.users.tenants / stats.users.total) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.users.total > 0 
                    ? ((stats.users.tenants / stats.users.total) * 100).toFixed(1) 
                    : 0}% of total users
                </p>
              </div>

              {/* Booking Stats */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Booking Value</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${stats?.revenue.average_booking.toFixed(2) || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Trend */}
          {analytics.monthly_trend && analytics.monthly_trend.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Property Creation Trend
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analytics.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Properties" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          )}

          {/* Properties by Type */}
          {analytics.by_type && analytics.by_type.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Properties by Type
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={analytics.by_type.map(item => ({
                        name: item.property_type?.replace('_', ' ') || 'Unknown',
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.by_type.map((entry, index) => {
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/admin/properties?status=pending_approval"
              className="p-6 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-center"
            >
              <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Review Properties</h3>
              <p className="text-sm text-gray-600">
                {stats?.properties.pending || 0} pending approval
              </p>
            </Link>

            <Link
              to="/admin/users"
              className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
            >
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">
                {stats?.users.total || 0} total users
              </p>
            </Link>

            <Link
              to="/admin/bookings"
              className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
            >
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Manage Bookings</h3>
              <p className="text-sm text-gray-600">
                {stats?.bookings.total || 0} total bookings
              </p>
            </Link>

            <Link
              to="/admin/analytics"
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center"
            >
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-600">Detailed insights</p>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
