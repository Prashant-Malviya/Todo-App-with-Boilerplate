import { SharedTask, CreateSharedTaskParams } from '../types';

import SharedTaskRepository from './store/shared-task-repository';
import SharedTaskUtil from './shared-task-util';

export default class SharedTaskWriter {
  public static async createSharedTask(
    params: CreateSharedTaskParams,
  ): Promise<SharedTask> {
    const newSharedTask = new SharedTaskRepository({
      task: params.taskId,
      account: params.accountId,
    });
    const createdSharedTask = await newSharedTask.save();
    return SharedTaskUtil.convertSharedTaskDBToSharedTask(createdSharedTask);
  }
}