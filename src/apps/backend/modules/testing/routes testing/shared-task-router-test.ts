import request from 'supertest';
import express from 'express';
import SharedTaskRouter from '../../shared-tasks/rest-api/shared-task-router';
import { expect } from 'chai';
import { accessAuthMiddleware } from '../../access-token';

jest.mock('../../access-token', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
const router = new SharedTaskRouter();
router.configure();
app.use('/shared-tasks', router.router);

describe('SharedTaskRouter', () => {
  it('should use accessAuthMiddleware', async () => {
    await request(app).get('/shared-tasks');
    expect(accessAuthMiddleware).toHaveBeenCalled();
  });

  it('should create a shared task', async () => {
    const response = await request(app)
      .post('/shared-tasks')
      .send({ taskId: '1', accountIds: ['1'] });

    expect(response.status).toBe(201);
  });

  it('should get shared tasks for an account', async () => {
    const response = await request(app).get('/shared-tasks');
    expect(response.status).toBe(200);
  });
});
