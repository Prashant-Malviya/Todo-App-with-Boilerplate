import {
    SharedTask,
    GetAllSharedTasksParams,
    SharedTaskNotFoundError,
    GetSharedTaskParams,
  } from '../types';
  import SharedTaskRepository from './store/shared-task-repository';
  import SharedTaskUtil from './shared-task-util';
  
export default class SharedTaskReader {
  public static async getSharedTaskForAccount(
    params: GetSharedTaskParams,
  ): Promise<SharedTask> {
    const sharedTask = await SharedTaskRepository.findOne({
      _id: params.sharedTaskId,
      'task.account': params.accountId,
    });

    if (!sharedTask) {
      throw new SharedTaskNotFoundError(params.sharedTaskId);
    }

    return SharedTaskUtil.convertSharedTaskDBToSharedTask(sharedTask);
  }

  public static async getSharedTasksForAccount(
    params: GetAllSharedTasksParams,
  ): Promise<SharedTask[]> {
    const sharedTasks = await SharedTaskRepository.find({
      account: params.accountId,
    }).populate('task.account');

    return sharedTasks.map((sharedTask) =>
      SharedTaskUtil.convertSharedTaskDBToSharedTask(sharedTask),
    );
  }
}
  