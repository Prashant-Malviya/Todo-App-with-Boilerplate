import axios from 'axios';
import { Comment } from '../../types/comment';

export const getComments = async (taskId: string): Promise<Comment[]> => {
  const response = await axios.get(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (taskId: string, comment: string): Promise<Comment> => {
  const response = await axios.post('/comments', { taskId, comment });
  return response.data;
};

export const updateComment = async (commentId: string, comment: string): Promise<Comment> => {
  const response = await axios.put(`/comments/${commentId}`, { comment });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/comments/${commentId}`);
};
