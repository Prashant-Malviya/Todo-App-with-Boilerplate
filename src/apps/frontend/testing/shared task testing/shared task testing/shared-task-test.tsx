import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SharedTasks from './SharedTasks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const mockSharedTasks = [
  {
    id: '1',
    task: {
      id: '1',
      title: 'Sample Task 1',
      description: 'Description 1',
      account: { id: '3', firstName: 'Owner', lastName: 'One', username: 'owner1' },
    },
  },
  {
    id: '2',
    task: {
      id: '2',
      title: 'Sample Task 2',
      description: 'Description 2',
      account: { id: '4', firstName: 'Owner', lastName: 'Two', username: 'owner2' },
    },
  },
];

describe('SharedTasks', () => {
  beforeEach(() => {
    mock.onGet('/api/shared-tasks').reply(200, mockSharedTasks);
  });

  it('renders shared tasks correctly', async () => {
    render(<SharedTasks />);
    await waitFor(() => expect(screen.getByText('Sample Task 1')).toBeInTheDocument());
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Sample Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<SharedTasks />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles API failure', async () => {
    mock.onGet('/api/shared-tasks').reply(500);
    render(<SharedTasks />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.queryByText('Sample Task 1')).not.toBeInTheDocument();
  });
});
