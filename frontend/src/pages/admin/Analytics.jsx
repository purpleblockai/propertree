/**
 * Admin Analytics - Detailed analytics and insights
 */
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Home, Users, DollarSign, BarChart, 
  PieChart as PieChartIcon, LineChart, Activity, Calendar
} from 'lucide-react';
import { Container } from '../../components/layout';
import { Card, Loading } from '../../components/common';
import { toast } from 'react-hot-toast';
import { 
  LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/analytics/`, {
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
      toast.error('Error loading analytics');
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

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-2">Detailed platform statistics and trends</p>
      </div>

      {/* Properties by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-rose-600" />
              Properties by Type
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {analytics?.by_type && analytics.by_type.length > 0 ? (
              <div className="space-y-4">
                {analytics.by_type.map((item, index) => {
                  const total = analytics.by_type.reduce((sum, i) => sum + i.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  
                  const colors = [
                    'bg-rose-500',
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-yellow-500',
                    'bg-purple-500',
                    'bg-pink-500',
                  ];
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {item.property_type?.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${colors[index % colors.length]} h-3 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </Card.Body>
        </Card>

        {/* Properties by Status */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Properties by Status
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {analytics?.by_status && analytics.by_status.length > 0 ? (
              <div className="space-y-4">
                {analytics.by_status.map((item, index) => {
                  const total = analytics.by_status.reduce((sum, i) => sum + i.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  
                  const statusColors = {
                    pending: 'bg-yellow-500',
                    active: 'bg-green-500',
                    rejected: 'bg-red-500',
                    draft: 'bg-gray-500',
                    inactive: 'bg-gray-400',
                  };
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {item.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${statusColors[item.status] || 'bg-gray-500'} h-3 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Top Cities */}
      <Card className="mb-6">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            Top 10 Cities by Property Count
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {analytics?.by_city && analytics.by_city.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {analytics.by_city.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-700">{item.count}</p>
                    <p className="text-sm text-gray-700 font-medium">{item.city || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">properties</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card.Body>
      </Card>

      {/* Average Price by Type */}
      <Card className="mb-6">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Average Price by Property Type
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {analytics?.avg_price_by_type && analytics.avg_price_by_type.length > 0 ? (
            <div className="space-y-4">
              {analytics.avg_price_by_type.map((item, index) => {
                const maxPrice = Math.max(...analytics.avg_price_by_type.map(i => i.avg_price || 0));
                const barWidth = maxPrice > 0 ? ((item.avg_price / maxPrice) * 100).toFixed(1) : 0;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {item.property_type?.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ${item.avg_price ? item.avg_price.toFixed(2) : '0.00'} / night
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${barWidth}%` }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {barWidth > 15 ? `$${item.avg_price?.toFixed(0)}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card.Body>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Property Creation Trend (Last 12 Months)
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {analytics?.monthly_trend && analytics.monthly_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={analytics.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Properties Created" />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card.Body>
      </Card>

      {/* Platform Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.by_type?.reduce((sum, item) => sum + item.count, 0) || 0}
                </p>
              </div>
              <Home className="w-10 h-10 text-blue-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Properties</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.by_status?.find(s => s.status === 'approved')?.count || 0}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Top City</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.by_city?.[0]?.city || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {analytics?.by_city?.[0]?.count || 0} properties
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Analytics;



