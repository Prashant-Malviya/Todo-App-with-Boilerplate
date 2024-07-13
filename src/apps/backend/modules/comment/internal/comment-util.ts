import { Comment } from '../types';
import { CommentDB } from './store/comment-db';

export function convertCommentDBToComment(commentDb: CommentDB): Comment {
  const comment = new Comment();

  comment.id = commentDb._id.toString();


  
  if (typeof commentDb.account === 'string') {
    comment.account = commentDb.account;
  } else {
    comment.account = JSON.stringify(commentDb.account);
  }

  comment.task = commentDb.task.toString();
  comment.comment = commentDb.comment;

  return comment;
}

export default {
  convertCommentDBToComment,
};


