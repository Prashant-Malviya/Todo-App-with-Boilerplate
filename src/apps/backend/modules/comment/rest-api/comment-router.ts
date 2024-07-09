import { accessAuthMiddleware } from '../../access-token';
import { ApplicationRouter } from '../../application';

import { CommentController } from './comment-controller';

export default class CommentRouter extends ApplicationRouter {
  configure(): void {
    const { router } = this;
    const controller = new CommentController();

    router.use(accessAuthMiddleware);

    router.post('/', controller.createComment);
    router.get('/', controller.getCommentsForTask);
    router.put('/:id', controller.updateComment);
    router.delete('/:id', controller.deleteComment);
  }
}

