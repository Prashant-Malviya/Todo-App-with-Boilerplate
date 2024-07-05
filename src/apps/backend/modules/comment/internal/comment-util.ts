import { Comment } from '../types';
import { CommentDB } from './store/comment-db';

export const convertCommentDBToComment = (commentDb: CommentDB): Comment => ({
  id: commentDb._id.toString(),
  task: commentDb.task.toString(),
  account: commentDb.account,
  comment: commentDb.comment,
  createdAt: commentDb.createdAt,
  updatedAt: commentDb.updatedAt,
});

export default {
  convertCommentDBToComment,
};

