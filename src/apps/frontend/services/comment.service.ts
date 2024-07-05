import { AccessToken, ApiError, ApiResponse } from '../types';
import { Comment } from '../types/comment';
import { JsonObject } from '../types/common-types';

import APIService from './api.service';

export default class CommentService {
  private apiClientWithAuth = (method: string, url: string, body?: object) => {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token')!,
    ) as AccessToken;
    return this.apiClientWithAuth[method](url, body, {
      headers: {
        Authorization: `Bearer ${userAccessToken.token}`,
      },
    });
  };

  async addComment(taskId: string, comment: string): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.apiClientWithAuth('post', '/comments', { taskId, comment });
      return new ApiResponse(new Comment(response.data), undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data));
    }
  }

  async getComments(taskId: string): Promise<ApiResponse<Comment[]>> {
    try {
      const response = await this.apiClientWithAuth('get', `/comments/${taskId}`);
      return new ApiResponse(
        response.data.map((commentData: JsonObject) => new Comment(commentData)),
        undefined,
      );
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data));
    }
  }

  async updateComment(commentId: string, taskId: string, comment: string): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.apiClientWithAuth('put', `/comments/${commentId}`, { taskId, comment });
      return new ApiResponse(new Comment(response.data), undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data));
    }
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    try {
      await this.apiClientWithAuth('delete', `/comments/${commentId}`);
      return new ApiResponse(undefined, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data));
    }
  }
}

