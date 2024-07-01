import { Comment } from '../types';
import { IComment } from './repository/comment-model';

export default class CommentUtil {
  public static toComment(commentDb: IComment): Comment {
    return new Comment(
      commentDb._id.toString(),
      commentDb.task.toString(),
      commentDb.user.toString(),
      commentDb.text,
      commentDb.isActive,
      commentDb.createdAt,
      commentDb.updatedAt
    );
  }
}
