import { SharedTask, GetAllSharedTasksParams } from '../types';
import SharedTaskRepository from './store/shared-task-repository';
import SharedTaskUtil from './shared-task-util';

export default class SharedTaskReader {
  public static async getSharedTasksForAccount(
    params: GetAllSharedTasksParams,
  ): Promise<SharedTask[]> {
    const sharedTasks = await SharedTaskRepository.find({
      account: params.accountId,
    }).populate({
      path: 'task',
      populate:{
        path:'account'           
      }
    });

    return sharedTasks.map(SharedTaskUtil.convertSharedTaskDBToSharedTask);
  }
}



