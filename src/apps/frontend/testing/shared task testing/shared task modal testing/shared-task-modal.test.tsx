import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { toast } from 'react-hot-toast';
import ShareTaskModal from '../../../pages/tasks/share-task-modal';
import { AccountService } from '../../../services';
import SharedTaskService from '../../../services/shared-task.service';
import { expect } from 'chai';
import { Task } from '../../../types/task';

jest.mock('../../services/account.service');
jest.mock('../../services/shared-task.service');
jest.mock('react-hot-toast');



const mockAccounts = [
  { id: '1', firstName: 'John', lastName: 'Doe', username: 'johndoe' },
  { id: '2', firstName: 'Jane', lastName: 'Doe', username: 'janedoe' },
];

const mockTask: Task = {
  id: '1',
  title: 'Sample Task',
  description: 'This is a sample task',
  account: { id: '3', firstName: 'Owner', lastName: 'Owner', username: 'owner' },
};

describe('ShareTaskModal', () => {
  beforeEach(() => {
    AccountService.prototype.getAccounts = jest.fn().mockResolvedValue({ data: mockAccounts });
    SharedTaskService.prototype.shareTask = jest.fn().mockResolvedValue({});
  });

  it('renders correctly', () => {
    render(<ShareTaskModal  show={true} onHide={() => { } } task={mockTask} isModalOpen={false} setIsModalOpen={function (open: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(screen.getByText('Share Task With Your Friends')).toBeInTheDocument();
  });

  it('fetches and displays accounts', async () => {
    render(<ShareTaskModal show={true} onHide={() => { } } task={mockTask} isModalOpen={false} setIsModalOpen={function (open: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    await waitFor(() => expect(AccountService.prototype.getAccounts).toHaveBeenCalled());
    expect(screen.getByLabelText('John')).toBeInTheDocument();
    expect(screen.getByLabelText('Jane')).toBeInTheDocument();
  });

  it('handles account selection', async () => {
    render(<ShareTaskModal show={true} onHide={() => { } } task={mockTask} isModalOpen={false} setIsModalOpen={function (open: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    await waitFor(() => screen.getByLabelText('John'));
    fireEvent.click(screen.getByLabelText('John'));
    expect(screen.getByLabelText('John')).toBeChecked();
  });

  it('shares task successfully', async () => {
    render(<ShareTaskModal show={true} onHide={() => { } } task={mockTask} isModalOpen={false} setIsModalOpen={function (open: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    await waitFor(() => screen.getByLabelText('John'));
    fireEvent.click(screen.getByLabelText('John'));
    fireEvent.click(screen.getByText('Share Task'));
    await waitFor(() => expect(SharedTaskService.prototype.shareTask).toHaveBeenCalledWith(mockTask.id, ['1']));
    expect(toast.success).toHaveBeenCalledWith('Task shared successfully');
  });

  it('handles task sharing failure', async () => {
    SharedTaskService.prototype.shareTask = jest.fn().mockRejectedValue(new Error('Failed to share task'));
    render(<ShareTaskModal show={true} onHide={() => { } } task={mockTask} isModalOpen={false} setIsModalOpen={function (open: boolean): void {
      throw new Error('Function not implemented.');
    } } />);
    await waitFor(() => screen.getByLabelText('John'));
    fireEvent.click(screen.getByLabelText('John'));
    fireEvent.click(screen.getByText('Share Task'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to share task'));
  });
});
