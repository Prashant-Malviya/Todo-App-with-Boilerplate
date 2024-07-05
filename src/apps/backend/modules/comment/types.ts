import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';

export class Comment {
  id!: string;
  task!: string;
  account!: any;
  comment!: string;
  createdAt!: Date;
  updatedAt!: Date;
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
