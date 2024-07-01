import { Comment } from '../types';

export const serializeCommentAsJSON = (comment: Comment): object => ({
  id: comment.id,
  taskId: comment.taskId,
  userId: comment.userId,
  text: comment.text,
  isActive: comment.isActive,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});
