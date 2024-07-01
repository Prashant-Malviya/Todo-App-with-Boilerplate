import CommentRepository from './repository/comment-repository';
import CommentUtil from './comment-util';
import { Comment, GetCommentsParams } from '../types';

export default class CommentReader {
  public static async getComments(params: GetCommentsParams): Promise<Comment[]> {
    const commentsDb = await CommentRepository.find({ task: params.taskId, isActive: true });
    return commentsDb.map(CommentUtil.toComment);
  }
}
