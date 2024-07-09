import {Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import CommentService from '../comment-service';
import {
  Comment,
  CreateCommentParams,
  UpdateCommentParams,
  DeleteCommentParams,
  GetCommentParams,
} from '../types';

import { serializeCommentAsJSON } from './comment-serializer';

export class CommentController {
  public async createComment(req: Request<CreateCommentParams>, res: Response): Promise<void> {
    const { taskId, comment } = req.body;
    const accountId = req.accountId;

    const createdComment: Comment = await CommentService.createComment({ taskId, accountId, comment });
    const commentJSON = serializeCommentAsJSON(createdComment);

    res.status(HttpStatusCodes.CREATED).send(commentJSON);
  }

  public async deleteComment(req: Request<DeleteCommentParams>, res: Response): Promise<void> {
    const { id } = req.params;
    const accountId = req.accountId;

    await CommentService.deleteComment({ accountId, commentId: id });

    res.status(HttpStatusCodes.NO_CONTENT).send();
  }

  public async getCommentsForTask(req: Request<GetCommentParams>, res: Response): Promise<void> {
    const { taskId } = req.params;

    const comments = await CommentService.getCommentsForTask(taskId);
    const commentsJSON = comments.map(serializeCommentAsJSON);

    res.status(HttpStatusCodes.OK).send(commentsJSON);
  }

  public async updateComment(req: Request<UpdateCommentParams>, res: Response): Promise<void> {
    const { id } = req.params;
    const { taskId, comment } = req.body;
    const accountId = req.accountId;

    const updatedComment: Comment = await CommentService.updateComment({
      accountId,
      commentId: id,
      taskId,
      comment,
    });
    const commentJSON = serializeCommentAsJSON(updatedComment);

    res.status(HttpStatusCodes.OK).send(commentJSON);
  }
}

