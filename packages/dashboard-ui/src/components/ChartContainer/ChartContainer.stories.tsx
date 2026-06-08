import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer } from './ChartContainer';
import { Button } from '../Button';

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/ChartContainer',
  component: ChartContainer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const PlaceholderChart = () => (
  <div
    style={{
      width: '100%',
      height: 200,
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4338ca',
      fontWeight: 500,
    }}
  >
    Chart Placeholder
  </div>
);

export const Default: Story = {
  args: {
    title: 'Job Applications',
    subtitle: 'Last 30 days',
    children: <PlaceholderChart />,
    actions: (
      <Button size="sm" variant="secondary">
        Export
      </Button>
    ),
  },
};

export const Loading: Story = {
  args: {
    title: 'User Growth',
    isLoading: true,
    children: <PlaceholderChart />,
  },
};
