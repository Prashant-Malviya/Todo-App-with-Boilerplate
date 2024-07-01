import { ApplicationRepository } from '../../../application';
import { IComment, commentSchema } from './comment-model';

const CommentRepository = ApplicationRepository<IComment>('Comment', commentSchema);

export default CommentRepository;
