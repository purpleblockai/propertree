/**
 * Donut Chart Component - Displays data in a donut chart format
 * Uses Recharts library
 */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  income: '#10B981',    // green
  expenses: '#EF4444',  // red
  maintenance: '#F59E0B', // amber
  utilities: '#3B82F6',   // blue
  taxes: '#8B5CF6',       // purple
  insurance: '#EC4899',   // pink
  other: '#6B7280'        // gray
};

const DonutChart = ({ 
  data, 
  title, 
  centerLabel,
  centerValue,
  height = 300,
  showLegend = true 
}) => {
  const CustomLabel = ({ cx, cy }) => (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-medium fill-gray-600"
      >
        {centerLabel}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-2xl font-bold fill-gray-900"
      >
        {centerValue}
      </text>
    </g>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.payload.fill }}>
            €{data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category] || COLORS.other}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          )}
          {centerLabel && <CustomLabel />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;




