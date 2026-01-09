/**
 * Line Chart Component - Displays data in a line chart format
 * Uses Recharts library for cash flow visualization
 */
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const LineChart = ({ 
  data, 
  title,
  xAxisKey = 'month',
  lines = [{ dataKey: 'value', stroke: '#10B981', name: 'Value' }],
  height = 300,
  showArea = false,
  yAxisFormatter = (value) => formatCurrency(value)
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.stroke || entry.fill }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-semibold text-gray-900">
                {yAxisFormatter(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = showArea ? AreaChart : RechartsLineChart;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#E5E7EB"
            tickFormatter={yAxisFormatter}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {showArea ? (
            lines.map((line, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                fill={line.fill || line.stroke + '20'}
                name={line.name}
                strokeWidth={2}
              />
            ))
          ) : (
            lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;


