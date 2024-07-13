import { SharedTask } from '../types';
import { SharedTaskDB } from './store/shared-task-db';

export default class SharedTaskUtil {
  public static convertSharedTaskDBToSharedTask(
    sharedTaskDb: SharedTaskDB
  ): SharedTask {
    const sharedTask = new SharedTask();
    sharedTask.id = sharedTaskDb._id.toString();
    

    if (typeof sharedTaskDb.task === 'string') {
      sharedTask.task = sharedTaskDb.task;
    } else {
      sharedTask.task = JSON.stringify(sharedTaskDb.task);
    }

    sharedTask.account = sharedTaskDb.account.toString();
    return sharedTask;
  }
}


