import axios from 'axios';
import { Comment } from '../types/comment';

export const getComments = async (taskId: string): Promise<Comment[]> => {
  const response = await axios.get(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (taskId: string, text: string): Promise<Comment> => {
  const response = await axios.post('/comments', { taskId, comment: text });
  return response.data;
};

export const updateComment = async (commentId: string, text: string): Promise<Comment> => {
  const response = await axios.put(`/comments/${commentId}`, { comment: text });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/comments/${commentId}`);
};
