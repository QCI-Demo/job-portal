import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from '../ChartContainer';

describe('ChartContainer', () => {
  it('renders title and children', () => {
    render(
      <ChartContainer title="Applications Over Time">
        <div data-testid="chart">Chart content</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Applications Over Time')).toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <ChartContainer title="Stats" subtitle="Last 30 days">
        <div>Chart</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <ChartContainer title="Stats" isLoading>
        <div>Chart</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
    expect(screen.queryByText('Chart')).not.toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <ChartContainer title="Stats" actions={<button>Export</button>}>
        <div>Chart</div>
      </ChartContainer>,
    );
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });
});
