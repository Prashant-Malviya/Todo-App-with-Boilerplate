import { SharedTask } from '../types';
import { SharedTaskDB } from './store/shared-task-db';

export default class SharedTaskUtil {
  public static convertSharedTaskDBToSharedTask(
    sharedTaskDb: SharedTaskDB
  ): SharedTask {
    return {
      id: sharedTaskDb._id.toString(),
      task: sharedTaskDb.task,
      account: sharedTaskDb.account.toString(),
    };
  }
}
