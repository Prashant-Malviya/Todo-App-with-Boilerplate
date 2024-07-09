import chai, { expect } from 'chai';
import { AccessToken } from '../../../src/apps/backend/modules/access-token';
import { Account } from '../../../src/apps/backend/modules/account';
import { ObjectIdUtils } from '../../../src/apps/backend/modules/database';
import { createAccount } from '../../helpers/account';
import { app } from '../../helpers/app';
import { SharedTaskService } from '../../../dist/modules/shared-tasks';
import { TaskService } from '../../../dist/modules/task';
import SharedTaskRepository from '../../../src/apps/backend/modules/shared-tasks/internal/store/shared-task-repository';

describe('Shared Task API', () => {
  let account: Account;
  let accessToken: AccessToken;

  beforeEach(async () => {
    ({ account, accessToken } = await createAccount());
  });

  describe('POST /shared-tasks', () => {
    it('should be able to share a task with multiple accounts', async () => {
      const task = await TaskService.createTask({
        accountId: account.id,
        title: 'my-task',
        description: 'This is a test description.',
      });

      const { account: anotherAccount } = await createAccount();

      const res = await chai
        .request(app)
        .post('/api/shared-tasks')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          taskId: task.id,
          accountIds: [anotherAccount.id],
        });

      expect(res.status).to.eq(201);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(1);
      expect(res.body[0].task).to.eq(task.id);
      expect(res.body[0].account).to.eq(anotherAccount.id);
    });

    it('should return error if trying to share task without taskId or accountIds', async () => {
      const res = await chai
        .request(app)
        .post('/api/shared-tasks')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          accountIds: [],
        });

      expect(res.status).to.eq(400);
    });
  });

  describe('GET /shared-tasks', () => {
    it('should return shared tasks for the account', async () => {
      const task = await TaskService.createTask({
        accountId: account.id,
        title: 'my-task',
        description: 'This is a test description.',
      });

      const { account: anotherAccount } = await createAccount();

      await SharedTaskService.createSharedTask({
        taskId: task.id,
        accountId: anotherAccount.id,
      });

      const res = await chai
        .request(app)
        .get('/api/shared-tasks')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });

    it('should return empty array if no tasks shared with the account', async () => {
      const res = await chai
        .request(app)
        .get('/api/shared-tasks')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(0);
    });
  });

  describe('DELETE /shared-tasks/:id', () => {
    it('should be able to delete a shared task', async () => {
      const task = await TaskService.createTask({
        accountId: account.id,
        title: 'my-task',
        description: 'This is a test description.',
      });

      const { account: anotherAccount } = await createAccount();

      const sharedTask = await SharedTaskService.createSharedTask({
        taskId: task.id,
        accountId: anotherAccount.id,
      });

      const res = await chai
        .request(app)
        .delete(`/api/shared-tasks/${sharedTask.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).to.eq(204);
      const updatedSharedTask = await SharedTaskRepository.findById(sharedTask.id);
      expect(updatedSharedTask.active).to.be.false;
    });

    it('should return error if shared task does not exist', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/shared-tasks/${ObjectIdUtils.createNew()}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send();

      expect(res.status).to.eq(404);
    });
  });
});

