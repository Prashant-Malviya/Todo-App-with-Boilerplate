import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';

export class SharedTask {
  id: string;
  task: any;
  account: any;
}

export type CreateSharedTaskParams = {
  taskId: string;
  accountId: string;
};

export type CreateSharedTasksParams = {
  taskId: string;
  accountIds: string[];
};

export interface GetSharedTaskParams {
  sharedTaskId: string;
  accountId: string;
}

export interface GetAllSharedTasksParams {
  accountId: string;
}

export class SharedTaskNotFoundError extends ApplicationError {
  code: string;

  constructor(sharedTaskId: string) {
    super(`Shared task with ID ${sharedTaskId} not found.`);
    this.code = 'SHARED_TASK_NOT_FOUND';
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}
