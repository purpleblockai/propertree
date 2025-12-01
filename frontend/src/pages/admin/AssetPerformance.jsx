/**
 * Asset Performance & KPIs - Manage asset performance and KPIs
 */
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/layout';
import { Card, Loading, Button, Select } from '../../components/common';
import { 
  TrendingUp, TrendingDown, DollarSign, Home, 
  Users, Calendar, BarChart3, PieChart, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast } from 'react-hot-toast';

const AssetPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/admin/analytics/performance/?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data);
      } else {
        toast.error('Error loading performance data');
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Error loading performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  // Mock data structure if API doesn't return data
  const mockData = performanceData || {
    kpis: {
      total_revenue: 125000,
      revenue_change: 12.5,
      occupancy_rate: 78.5,
      occupancy_change: 5.2,
      average_booking_value: 450,
      booking_value_change: -2.1,
      total_bookings: 278,
      bookings_change: 8.3,
    },
    monthly_revenue: [
      { month: 'Jan', revenue: 8500, expenses: 3200, profit: 5300 },
      { month: 'Feb', revenue: 9200, expenses: 3400, profit: 5800 },
      { month: 'Mar', revenue: 7800, expenses: 3100, profit: 4700 },
      { month: 'Apr', revenue: 10100, expenses: 3600, profit: 6500 },
      { month: 'May', revenue: 11200, expenses: 3800, profit: 7400 },
      { month: 'Jun', revenue: 12500, expenses: 4000, profit: 8500 },
    ],
    property_performance: [
      { property: 'Property A', revenue: 25000, bookings: 45, occupancy: 85 },
      { property: 'Property B', revenue: 22000, bookings: 38, occupancy: 78 },
      { property: 'Property C', revenue: 18000, bookings: 32, occupancy: 72 },
      { property: 'Property D', revenue: 15000, bookings: 28, occupancy: 68 },
    ],
    expense_categories: [
      { name: 'Management Fees', value: 18000, color: '#3b82f6' },
      { name: 'Mortgage/Loan', value: 36000, color: '#10b981' },
      { name: 'Cleaning', value: 21750, color: '#f59e0b' },
      { name: 'Maintenance', value: 11500, color: '#ef4444' },
      { name: 'Utilities', value: 26200, color: '#8b5cf6' },
      { name: 'Taxes', value: 22900, color: '#ec4899' },
    ],
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Performance & KPIs</h1>
          <p className="text-gray-600 mt-2">Monitor and manage asset performance metrics</p>
        </div>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
            { value: '365', label: 'Last year' },
          ]}
          className="w-48"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              {mockData.kpis.revenue_change >= 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+{mockData.kpis.revenue_change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{mockData.kpis.revenue_change}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              €{mockData.kpis.total_revenue.toLocaleString()}
            </p>
          </Card.Body>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              {mockData.kpis.occupancy_change >= 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+{mockData.kpis.occupancy_change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{mockData.kpis.occupancy_change}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockData.kpis.occupancy_rate}%
            </p>
          </Card.Body>
        </Card>

        {/* Average Booking Value */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              {mockData.kpis.booking_value_change >= 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+{mockData.kpis.booking_value_change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{mockData.kpis.booking_value_change}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Booking Value</p>
            <p className="text-2xl font-bold text-gray-900">
              €{mockData.kpis.average_booking_value}
            </p>
          </Card.Body>
        </Card>

        {/* Total Bookings */}
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              {mockData.kpis.bookings_change >= 0 ? (
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+{mockData.kpis.bookings_change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{mockData.kpis.bookings_change}%</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockData.kpis.total_bookings}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue vs Expenses */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Revenue vs Expenses
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Profit Trend */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Profit Trend
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData.monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </div>

      {/* Property Performance Table */}
      <Card className="mb-8">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Property Performance Breakdown
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockData.property_performance.map((property, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {property.property}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      €{property.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {property.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${property.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{property.occupancy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Expense Categories */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Expenses by Category
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={mockData.expense_categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.expense_categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {mockData.expense_categories.map((category, index) => {
                const total = mockData.expense_categories.reduce((sum, c) => sum + c.value, 0);
                const percentage = ((category.value / total) * 100).toFixed(1);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-bold text-gray-900">
                        €{category.value.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color || COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AssetPerformance;


