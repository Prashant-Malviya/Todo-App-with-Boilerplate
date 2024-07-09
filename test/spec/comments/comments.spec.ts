import chai, { expect } from 'chai';
import { AccessToken } from '../../../src/apps/backend/modules/access-token';
import { Account } from '../../../src/apps/backend/modules/account';
import CommentService from '../../../src/apps/backend/modules/comment/comment-service';
import CommentRepository from '../../../src/apps/backend/modules/comment/internal/store/comment-repository';
import { createAccount } from '../../helpers/account';
import { app } from '../../helpers/app';

describe('Comment API', () => {
  let account: Account;
  let accessToken: AccessToken;

  beforeEach(async () => {
    ({ account, accessToken } = await createAccount());
  });

  describe('GET /comments/:taskId', () => {
    it('should return a list of comments for a specific task', async () => {
      const comment1 = await CommentService.createComment(account.id, 'task-1', 'This is a test comment 1');
      const comment2 = await CommentService.createComment(account.id, 'task-1', 'This is a test comment 2');

      const res = await chai
        .request(app)
        .get('/api/comments/task-1')
        .set('Authorization', `Bearer ${accessToken.token}`);

      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(2);
      expect(res.body[0].id).to.eq(comment1.id);
      expect(res.body[1].id).to.eq(comment2.id);
    });

    it('should return an empty array if no comments exist for the task', async () => {
      const res = await chai
        .request(app)
        .get('/api/comments/task-2')
        .set('Authorization', `Bearer ${accessToken.token}`);

      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(0);
    });
  });

  describe('POST /comments', () => {
    it('should create a new comment for a task', async () => {
      const res = await chai
        .request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({ taskId: 'task-1', comment: 'This is a new comment' });

      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('taskId', 'task-1');
      expect(res.body).to.have.property('comment', 'This is a new comment');
      expect(res.body).to.have.property('accountId', account.id);
    });

    it('should return an error if comment is empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({ taskId: 'task-1', comment: '' });

      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('message', 'Comment cannot be empty');
    });
  });

  describe('PUT /comments/:commentId', () => {
    it('should update an existing comment', async () => {
      const comment = await CommentService.createComment(account.id, 'task-1', 'This is a test comment');

      const res = await chai
        .request(app)
        .put(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({ comment: 'This is an updated comment' });

      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('id', comment.id);
      expect(res.body).to.have.property('comment', 'This is an updated comment');
    });

    it('should return an error if comment does not exist', async () => {
      const res = await chai
        .request(app)
        .put(`/api/comments/nonexistent-comment-id`)
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({ comment: 'This is an updated comment' });

      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('message', 'Comment not found');
    });
  });

  describe('DELETE /comments/:commentId', () => {
    it('should delete an existing comment', async () => {
      const comment = await CommentService.createComment(account.id, 'task-1', 'This is a test comment');

      const res = await chai
        .request(app)
        .delete(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${accessToken.token}`);

      expect(res.status).to.eq(204);

      const deletedComment = await CommentRepository.findById(comment.id);
      expect(deletedComment).to.be.null;
    });

    it('should return an error if comment does not exist', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/comments/nonexistent-comment-id`)
        .set('Authorization', `Bearer ${accessToken.token}`);

      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('message', 'Comment not found');
    });
  });
});

