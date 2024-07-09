import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SharedTaskService from './shared-task.service';
import { AccessToken, ApiResponse } from '../types';

const mock = new MockAdapter(axios);

const mockAccessToken: AccessToken = {
  token: 'mock-token',
  expiresAt: new Date().toISOString(),
};

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
];

describe('SharedTaskService', () => {
  beforeEach(() => {
    localStorage.setItem('access-token', JSON.stringify(mockAccessToken));
  });

  afterEach(() => {
    localStorage.clear();
    mock.reset();
  });

  it('shares task successfully', async () => {
    const taskId = '1';
    const accountIds = ['1', '2'];
    mock.onPost('/shared-tasks').reply(200);

    const sharedTaskService = new SharedTaskService();
    const response = await sharedTaskService.shareTask(taskId, accountIds);

    expect(response).toBeInstanceOf(ApiResponse);
    expect(response.data).toBeUndefined();
  });

  it('fetches shared tasks successfully', async () => {
    mock.onGet('/shared-tasks').reply(200, mockSharedTasks);

    const sharedTaskService = new SharedTaskService();
    const response = await sharedTaskService.getSharedTasks();

    expect(response).toBeInstanceOf(ApiResponse);
    expect(response.data).toEqual(mockSharedTasks);
  });
});
