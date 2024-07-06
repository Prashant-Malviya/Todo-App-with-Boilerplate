import {
    CreateCommentParams,
    DeleteCommentParams,
    Comment,
    CommentNotFoundError,
    UpdateCommentParams,
  } from '../types';
  
  import CommentRepository from './store/comment-repository';
  import CommentUtil from './comment-util';
  
  export default class CommentWriter {
    public static async createComment(params: CreateCommentParams): Promise<Comment> {
      const newComment = new CommentRepository({
        task: params.taskId,
        account: params.accountId,
        comment: params.comment,
      });
      const createdComment = await newComment.save().then(comment => comment.populate('account'));
      return CommentUtil.convertCommentDBToComment(createdComment);
    }
  
    public static async updateComment(
      params: UpdateCommentParams,
    ): Promise<Comment> {
      const updatedComment = await CommentRepository.findByIdAndUpdate(
        params.commentId,
        {
          $set: {
            comment: params.comment,
          },
        },
        { new: true },
      ).populate('account');

      if (!updatedComment) {
        throw new CommentNotFoundError(params.commentId);
      }

      return CommentUtil.convertCommentDBToComment(updatedComment);
    }
  
    public static async deleteComment(
      {commentId }: DeleteCommentParams,
    ): Promise<void> {
      const comment = await CommentRepository.findByIdAndUpdate(
        commentId,
        {
          $set: {
            active: false,
          },
        },
        { new: true },
      ).populate('account');

      if (!comment) {
        throw new CommentNotFoundError(commentId);
      }
    }
  }
  