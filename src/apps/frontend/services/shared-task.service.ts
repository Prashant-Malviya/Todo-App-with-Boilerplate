import { AccessToken, ApiResponse, ApiError } from '../types';
import APIService from './api.service';
import { SharedTask } from '../types/shared-task';

export default class SharedTaskService extends APIService {
  async shareTask(
    taskId: string,
    accountIds: string[],
  ): Promise<ApiResponse<void>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token'),
    ) as AccessToken;
    const response = await this.apiClient.post(
      '/shared-tasks',
      { taskId, accountIds },
      {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      },
    );
    return new ApiResponse(undefined, response.data);
  }

  async getSharedTasks(): Promise<ApiResponse<SharedTask[]>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token'),
    ) as AccessToken;
    const response = await this.apiClient.get('/shared-tasks', {
      headers: {
        Authorization: `Bearer ${userAccessToken.token}`,
      },
    });
    return new ApiResponse(
      response.data.map((taskData: any) => new SharedTask(taskData)),
      response.data,
    );
  }
}
