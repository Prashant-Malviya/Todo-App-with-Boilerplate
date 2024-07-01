import { CreateCommentParams, EditCommentParams, Comment } from '../types';
import CommentRepository from './repository/comment-repository';
import CommentUtil from './comment-util';
import { Types } from 'mongoose';

export default class CommentWriter {
  public static async createComment(params: CreateCommentParams): Promise<Comment> {
    const commentDb = await CommentRepository.create({
      task: new Types.ObjectId(params.taskId),
      user: new Types.ObjectId(params.userId),
      text: params.text,
      isActive: true,
    });
    return CommentUtil.toComment(commentDb);
  }

  public static async editComment(params: EditCommentParams): Promise<Comment | null> {
    const commentDb = await CommentRepository.findByIdAndUpdate(
      params.commentId,
      { text: params.text },
      { new: true }
    );
    return commentDb ? CommentUtil.toComment(commentDb) : null;
  }

  public static async deleteComment(commentId: string): Promise<void> {
    await CommentRepository.findByIdAndUpdate(commentId, { isActive: false });
  }

  public static async replyToComment(params: CreateCommentParams): Promise<Comment> {
    return this.createComment(params);
  }
}
