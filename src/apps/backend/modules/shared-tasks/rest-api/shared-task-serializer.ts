import { SharedTask } from '../types';

export function serializeSharedTaskAsJSON(sharedTask: SharedTask): object {
  return {
    id: sharedTask.id,
    task: {
      id: sharedTask.task.id,
      title: sharedTask.task.title,
      description: sharedTask.task.description,
      account: {
        id: sharedTask.task.account.id,
        firstName: sharedTask.task.account.firstName,
        lastName: sharedTask.task.account.lastName,
        username: sharedTask.task.account.username,
      },
    },
    account: sharedTask.account,
  };
}
