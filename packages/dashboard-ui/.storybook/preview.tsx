import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dashboard-ui">
        <Story />
      </div>
    ),
  ],
};

export default preview;
