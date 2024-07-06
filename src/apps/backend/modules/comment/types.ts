import { Account } from '../account';
import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';
import { Task } from '../task';

export class Comment {
  id!: string;
  task!: string | Task;
  account!: string | Account;
  comment!: string;
}

export interface CreateCommentParams {
  taskId: string;
  accountId: string;
  comment: string;
}

export interface UpdateCommentParams {
  taskId: string;
  accountId: string;
  comment: string;
  commentId: string;
}

export interface DeleteCommentParams {
  commentId: string;
  accountId: string;
}

export interface GetCommentParams {
  commentId: string;
  accountId: string;
}

export class CommentNotFoundError extends ApplicationError {
  code: string;

  constructor(commentId: string) {
    super(`Comment with commentId ${commentId} not found.`);
    this.code = 'COMMENT_NOT_FOUND';
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}
