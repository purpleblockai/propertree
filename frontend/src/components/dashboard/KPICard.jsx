/**
 * KPI Card Component - Displays key performance indicators
 */
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  subtitle,
  valuePrefix = '',
  valueSuffix = '',
  className = '' 
}) => {
  // Determine trend icon and color
  const getTrendIcon = () => {
    if (!trend || trend === 'neutral') return <Minus className="w-4 h-4" />;
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-gray-500';
    if (trend === 'up') return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">
              {valuePrefix}{value}{valueSuffix}
            </h3>
            {trendValue && (
              <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-propertree-green/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-propertree-green" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;




