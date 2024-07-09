import SharedTaskService from '../../shared-tasks/shared-task-service';
import SharedTaskRepository from '../../shared-tasks/internal/store/shared-task-repository';
import SharedTaskUtil from '../../shared-tasks/internal/shared-task-util';
import { Types } from 'mongoose';
import { expect } from 'chai';

jest.mock('./store/shared-task-repository');
jest.mock('./shared-task-util');

describe('SharedTaskService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSharedTask', () => {
    it('should create a shared task successfully', async () => {
      const taskId = new Types.ObjectId().toString();
      const accountId = new Types.ObjectId().toString();
      const params = { taskId, accountId };
      
      const sharedTask = { _id: new Types.ObjectId(), task: taskId, account: accountId };
      SharedTaskRepository.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(sharedTask),
      }));
      SharedTaskUtil.convertSharedTaskDBToSharedTask.mockReturnValue(sharedTask);

      const result = await SharedTaskService.createSharedTask(params);
      expect(result).equal(sharedTask);
      expect(SharedTaskRepository).toHaveBeenCalled();
    });
  });

  describe('getSharedTasksForAccount', () => {
    it('should return shared tasks for an account', async () => {
      const accountId = new Types.ObjectId().toString();
      const params = { accountId };
      
      const sharedTask = { _id: new Types.ObjectId(), task: new Types.ObjectId(), account: accountId };
      SharedTaskRepository.find.mockResolvedValue([sharedTask]);
      SharedTaskUtil.convertSharedTaskDBToSharedTask.mockReturnValue(sharedTask);

      const result = await SharedTaskService.getSharedTasksForAccount(params);
      expect(result).toEqual([sharedTask]);
      expect(SharedTaskRepository.find).toHaveBeenCalledWith({ account: accountId });
    });
  });
});
