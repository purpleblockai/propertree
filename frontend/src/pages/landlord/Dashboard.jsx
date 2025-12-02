/**
 * Landlord Dashboard - Main dashboard for property owners
 * Comprehensive view of property performance, income vs expenses, occupancy rates, and KPIs
 */
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/layout';
import { KPICard, DonutChart, BarChart, LineChart } from '../../components/dashboard';
import { Button, Loading } from '../../components/common';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Wrench,
  Users,
  ArrowRight,
  TrendingDown,
  PieChart,
  BarChart3,
  Activity,
  Settings,
  Plus,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // Default: last 30 days

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async (retryCount = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/analytics/landlord/dashboard/?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else if (response.status === 401 && retryCount === 0) {
        // Token expired - try to refresh
        console.log('Token expired, attempting to refresh...');
        try {
          await authService.refreshToken();
          // Retry the request with new token
          return fetchDashboardData(1);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Dashboard API Error:', response.status, errorData);
        toast.error(`Failed to load dashboard data: ${errorData.error || 'Unknown error'}`);
        // If API fails, set empty data structure with zeros
        setDashboardData({
          properties: { total: 0, approved: 0, booked: 0, pending: 0, draft: 0 },
          occupancy_rate: 0,
          rental_income: 0,
          pending_bookings: { pending_count: 0, pending_value: 0 },
          maintenance_costs: { total_cost: 0, count: 0, average_cost: 0 },
          property_expenses: { total_expenses: 0, count: 0, by_category: [] },
          noi: { noi: 0, revenue: 0, total_expenses: 0, maintenance_costs: 0, property_expenses: 0 },
          property_performance: [],
          average_booking: { average_nights: 0, total_bookings: 0 },
          monthly_cash_flow: [],
          annual_expenses: { year: new Date().getFullYear(), total_expenses: 0, by_category: [], maintenance_costs: 0, property_expenses: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Network error. Please check your connection.');
      // Set empty data structure with zeros on error
      setDashboardData({
        properties: { total: 0, approved: 0, booked: 0, pending: 0, draft: 0 },
        occupancy_rate: 0,
        rental_income: 0,
        pending_bookings: { pending_count: 0, pending_value: 0 },
        maintenance_costs: { total_cost: 0, count: 0, average_cost: 0 },
        property_expenses: { total_expenses: 0, count: 0, by_category: [] },
        noi: { noi: 0, revenue: 0, total_expenses: 0, maintenance_costs: 0, property_expenses: 0 },
        property_performance: [],
        average_booking: { average_nights: 0, total_bookings: 0 },
        monthly_cash_flow: [],
        annual_expenses: { year: new Date().getFullYear(), total_expenses: 0, by_category: [], maintenance_costs: 0, property_expenses: 0 }
      });
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

  if (!dashboardData) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  // Prepare chart data
  const incomeVsExpensesData = [
    { name: 'Income', value: dashboardData.noi.revenue, category: 'income' },
    { 
      name: 'Expenses', 
      value: dashboardData.noi.total_expenses, 
      category: 'expenses' 
    }
  ];

  // Enhanced expense breakdown with all categories
  // Note: property_expenses.by_category now includes maintenance costs from the backend
  const expenseCategories = dashboardData.property_expenses?.by_category || [];
  const expenseBreakdownData = expenseCategories.map(cat => ({
    name: cat.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: cat.amount,
    category: cat.category
  })).filter(item => item.value > 0);
  
  // If no expenses at all, show a placeholder
  if (expenseBreakdownData.length === 0 && dashboardData.noi.maintenance_costs > 0) {
    expenseBreakdownData.push({
      name: 'Maintenance',
      value: dashboardData.noi.maintenance_costs,
      category: 'maintenance'
    });
  }

  // Property performance for bar chart
  const propertyPerformanceChart = dashboardData.property_performance
    .slice(0, 5)
    .map(prop => ({
      name: prop.property_title.length > 15 ? prop.property_title.substring(0, 15) + '...' : prop.property_title,
      Income: prop.total_income,
      Expenses: prop.total_expenses,
      'Net Income': prop.net_income
    }));

  // Monthly cash flow data
  const cashFlowData = dashboardData.monthly_cash_flow || [];

  // Calculate ROI percentage
  const roi = dashboardData.noi.revenue > 0 
    ? ((dashboardData.noi.noi / dashboardData.noi.revenue) * 100).toFixed(1)
    : 0;

  // Annual expenses breakdown
  const annualExpenseCategories = dashboardData.annual_expenses?.by_category || [];

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Dashboard</h1>
          <p className="text-gray-600">
            Overview of your property performance and financial metrics
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propertree-green bg-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button
            onClick={() => navigate('/landlord/expenses')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Expenses
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Properties"
          value={dashboardData.properties.total}
          icon={Home}
          subtitle={`${dashboardData.properties.approved} approved`}
        />
        <KPICard
          title="Net Operating Income"
          value={dashboardData.noi.noi.toLocaleString()}
          valuePrefix="€"
          icon={DollarSign}
          trend={dashboardData.noi.noi > 0 ? 'up' : 'down'}
          trendValue={`${roi}% ROI`}
          subtitle="Revenue minus expenses"
        />
        <KPICard
          title="Occupancy Rate"
          value={`${dashboardData.occupancy_rate.toFixed(1)}%`}
          icon={Calendar}
          trend={dashboardData.occupancy_rate >= 70 ? 'up' : dashboardData.occupancy_rate >= 50 ? 'neutral' : 'down'}
          subtitle="Property utilization"
        />
        <KPICard
          title="Total Income"
          value={dashboardData.rental_income.toLocaleString()}
          valuePrefix="€"
          icon={TrendingUp}
          subtitle="From confirmed bookings"
        />
      </div>

      {/* Income vs Expenses Section - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DonutChart
          data={incomeVsExpensesData}
          title="Income vs Expenses"
          centerLabel="Net Income"
          centerValue={`€${dashboardData.noi.noi.toLocaleString()}`}
          height={350}
        />
        <DonutChart
          data={expenseBreakdownData.length > 0 ? expenseBreakdownData : [{ name: 'No Expenses', value: 1, category: 'other' }]}
          title="Expenses by Category"
          centerLabel="Total Expenses"
          centerValue={`€${dashboardData.noi.total_expenses.toLocaleString()}`}
          height={350}
        />
      </div>

      {/* Cash Flow Chart - NEW */}
      {cashFlowData.length > 0 && (
        <div className="mb-8">
          <LineChart
            data={cashFlowData}
            title="Monthly Cash Flow"
            xAxisKey="month_short"
            lines={[
              { dataKey: 'income', stroke: '#10B981', name: 'Income' },
              { dataKey: 'expenses', stroke: '#EF4444', name: 'Expenses' },
              { dataKey: 'net_cash_flow', stroke: '#3B82F6', name: 'Net Cash Flow' }
            ]}
            height={350}
            showArea={false}
          />
        </div>
      )}

      {/* Property Performance Bar Chart */}
      {dashboardData.property_performance.length > 0 && (
        <div className="mb-8">
          <BarChart
            data={propertyPerformanceChart}
            title="Top 5 Properties Performance"
            xAxisKey="name"
            bars={[
              { dataKey: 'Income', fill: '#10B981', name: 'Income' },
              { dataKey: 'Expenses', fill: '#EF4444', name: 'Expenses' },
              { dataKey: 'Net Income', fill: '#3B82F6', name: 'Net Income' }
            ]}
            height={350}
          />
        </div>
      )}

      {/* Additional Metrics Row - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            €{dashboardData.maintenance_costs.total_cost.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {dashboardData.maintenance_costs.count} requests resolved
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Avg: €{dashboardData.maintenance_costs.average_cost.toFixed(2)}
          </p>
          <Button
            onClick={() => navigate('/landlord/services')}
            variant="ghost"
            className="mt-4 w-full text-sm"
          >
            Book Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {dashboardData.average_booking.total_bookings}
          </p>
          <p className="text-sm text-gray-600">
            Total bookings
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Avg: {dashboardData.average_booking.average_nights} nights
          </p>
          <Button
            onClick={() => navigate('/landlord/bookings')}
            variant="ghost"
            className="mt-4 w-full text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {dashboardData.pending_bookings.pending_count}
          </p>
          <p className="text-sm text-gray-600">
            Awaiting confirmation
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Value: €{dashboardData.pending_bookings.pending_value.toLocaleString()}
          </p>
          <Button
            onClick={() => navigate('/landlord/bookings')}
            variant="ghost"
            className="mt-4 w-full text-sm"
          >
            Review
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Annual Expenses & Maintenance Section - NEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Annual Expenses Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Annual Expenses {dashboardData.annual_expenses?.year}</h3>
            <Button
              onClick={() => navigate('/landlord/expenses')}
              variant="ghost"
              className="text-sm"
            >
              View Details
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Annual Total</span>
              <span className="text-xl font-bold text-red-600">
                €{dashboardData.annual_expenses?.total_expenses.toLocaleString() || 0}
              </span>
            </div>
            {annualExpenseCategories.length > 0 ? (
              <div className="space-y-2">
                {annualExpenseCategories.slice(0, 5).map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 capitalize">
                      {cat.category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      €{cat.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No expenses recorded this year
              </p>
            )}
          </div>
        </div>

        {/* Maintenance Expenses Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Costs</h3>
            <Button
              onClick={() => navigate('/landlord/services')}
              variant="ghost"
              className="text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Book Service
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-amber-600">
                  €{dashboardData.maintenance_costs.total_cost.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.maintenance_costs.count}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Cost per Request</p>
              <p className="text-xl font-bold text-gray-900">
                €{dashboardData.maintenance_costs.average_cost.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => navigate('/landlord/services')}
              variant="primary"
              className="w-full"
            >
              View Service Catalog
            </Button>
          </div>
        </div>
      </div>

      {/* Property Performance Table - Enhanced */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Property Performance</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/landlord/properties')}
              variant="ghost"
              className="flex items-center gap-2 text-propertree-green"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {dashboardData.property_performance.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first property to see performance metrics</p>
            <Button
              onClick={() => navigate('/landlord/onboarding')}
              variant="primary"
            >
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Income
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.property_performance.map((property) => (
                  <tr key={property.property_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.property_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{property.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'booked'
                          ? 'bg-blue-100 text-blue-800'
                          : property.status === 'pending_approval'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-green-600">
                        €{property.total_income.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-red-600">
                        €{property.total_expenses.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-bold ${
                        property.net_income >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        €{property.net_income.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {property.booking_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        onClick={() => navigate(`/landlord/properties/${property.property_id}/edit`)}
                        variant="ghost"
                        className="text-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => navigate('/landlord/onboarding')}
          variant="primary"
          className="py-4 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Add New Property
        </Button>
        <Button
          onClick={() => navigate('/landlord/bookings')}
          variant="outline"
          className="py-4 flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Manage Bookings
        </Button>
        <Button
          onClick={() => navigate('/landlord/services')}
          variant="outline"
          className="py-4 flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Book Services
        </Button>
      </div>
    </Container>
  );
};

export default Dashboard;
