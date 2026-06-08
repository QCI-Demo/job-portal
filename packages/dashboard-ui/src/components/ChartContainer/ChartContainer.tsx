import React from 'react';
import './ChartContainer.css';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  height?: number;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  actions,
  isLoading = false,
  height = 300,
  className = '',
}) => {
  return (
    <div className={`dashboard-chart-container ${className}`}>
      <div className="dashboard-chart-container__header">
        <div>
          <h3 className="dashboard-chart-container__title">{title}</h3>
          {subtitle ? <p className="dashboard-chart-container__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="dashboard-chart-container__actions">{actions}</div> : null}
      </div>
      <div
        className="dashboard-chart-container__body"
        style={{ minHeight: height }}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="dashboard-chart-container__loading">Loading chart data...</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
