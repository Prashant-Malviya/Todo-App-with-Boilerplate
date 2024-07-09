import {SharedTaskController} from '../../shared-tasks/rest-api/shared-task-controller';
import SharedTaskService from '../../shared-tasks/shared-task-service';
import { HttpStatusCodes } from '../../http';
import { expect } from 'chai';

jest.mock('../shared-task-service');

describe('SharedTaskController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      accountId: new Types.ObjectId().toString(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSharedTask', () => {
    it('should create shared tasks and return 201', async () => {
      const sharedTasks = [{ id: '1', task: {}, account: '1' }];
      SharedTaskService.createSharedTask.mockResolvedValue(sharedTasks[0]);

      req.body = { taskId: '1', accountIds: ['1'] };
      await SharedTaskController.createSharedTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith([sharedTasks[0]]);
    });
  });

  describe('getSharedTasks', () => {
    it('should get shared tasks for an account and return 200', async () => {
      const sharedTasks = [{ id: '1', task: {}, account: '1' }];
      SharedTaskService.getSharedTasksForAccount.mockResolvedValue(sharedTasks);

      await SharedTaskController.getSharedTasks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(sharedTasks);
    });
  });
});
