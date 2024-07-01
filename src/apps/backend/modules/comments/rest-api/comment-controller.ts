import { Request, Response } from 'express';
import CommentService from '../comment-service';
import { HttpStatusCodes } from '../../http';
import { applicationController } from '../../application';
import { serializeCommentAsJSON } from './comment-serializer';
import { CreateCommentParams, EditCommentParams, GetCommentsParams } from '../types';

export class CommentController {
  createComment = applicationController(
    async (req: Request<{}, {}, CreateCommentParams>, res: Response) => {
      const comment = await CommentService.createComment(req.body);
      res.status(HttpStatusCodes.CREATED).send(serializeCommentAsJSON(comment));
    }
  );

  editComment = applicationController(
    async (req: Request<{}, {}, EditCommentParams>, res: Response) => {
      const comment = await CommentService.editComment(req.body);
      if (comment) {
        res.status(HttpStatusCodes.OK).send(serializeCommentAsJSON(comment));
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).send({ error: 'Comment not found' });
      }
    }
  );

  deleteComment = applicationController(
    async (req: Request<{ commentId: string }>, res: Response) => {
      await CommentService.deleteComment(req.params.commentId);
      res.status(HttpStatusCodes.NO_CONTENT).send();
    }
  );

  getComments = applicationController(
    async (req: Request<GetCommentsParams>, res: Response) => {
      const comments = await CommentService.getComments({ taskId: req.params.taskId });
      res.status(HttpStatusCodes.OK).send(comments.map(serializeCommentAsJSON));
    }
  );

  replyToComment = applicationController(
    async (req: Request<{}, {}, CreateCommentParams>, res: Response) => {
      const comment = await CommentService.replyToComment(req.body);
      res.status(HttpStatusCodes.CREATED).send(serializeCommentAsJSON(comment));
    }
  );
}
