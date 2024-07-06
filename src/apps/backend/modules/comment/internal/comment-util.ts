import { Comment } from '../types';
import { CommentDB } from './store/comment-db';

export function convertCommentDBToComment(commentDb: CommentDB): Comment {

  const comment = new Comment();
  
  comment.id = commentDb._id.toString();
  comment.account = commentDb.account.toString();
  comment.task = commentDb.task.toString();
  comment.comment = commentDb.comment;

  return comment;
};

export default {
  convertCommentDBToComment,
};

