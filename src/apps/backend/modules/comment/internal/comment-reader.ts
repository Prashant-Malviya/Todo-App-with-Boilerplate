import { GetCommentParams, Comment, CommentNotFoundError } from '../types';
import CommentRepository from './store/comment-repository';
import CommentUtil from './comment-util';

type CommentReaderMethods = {
  getCommentForAccount: (
    params: GetCommentParams,
  ) => Promise<Comment>;
  getCommentsForTask: (taskId: string) => Promise<Comment[]>;
};

export const CommentReader: CommentReaderMethods = {
  async getCommentForAccount({
    commentId,
    accountId,
  }: GetCommentParams): Promise<Comment> {
    const commentDb = await CommentRepository.findOne({
      _id: commentId,
      account: accountId,
    });

    if (!commentDb) {
      throw new CommentNotFoundError(commentId);
    }

    return CommentUtil.convertCommentDBToComment(commentDb);
  },

  async getCommentsForTask(taskId: string): Promise<Comment[]> {
    const commentsDb = await CommentRepository.find({ task: taskId })
      .populate({
        path: 'account',
        model: 'accounts',
      })
      .exec();

    return commentsDb.map(CommentUtil.convertCommentDBToComment);
  },
};

export default CommentReader;