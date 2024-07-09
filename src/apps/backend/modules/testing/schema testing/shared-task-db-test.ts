import { expect } from 'chai';
import  SharedTaskDbSchema  from '../../task/internal/store/shared-task-db';
import mongoose from 'mongoose';

describe('SharedTaskDbSchema', () => {
  it('should have correct schema definition', () => {
    const schemaPaths = Object.keys(SharedTaskDbSchema.paths);
    expect(schemaPaths).equal(expect.arrayContaining(['task', 'account', 'active', 'createdAt', 'updatedAt']));
  });

  it('should require task and account fields', () => {
    const SharedTask = mongoose.model('SharedTask', SharedTaskDbSchema);
    const sharedTask = new SharedTask({});
    const validationError = sharedTask.validateSync();
    expect(validationError.errors.task).toBeDefined();
    expect(validationError.errors.account).toBeDefined();
  });

  it('should set default value for active to true', () => {
    const SharedTask = mongoose.model('SharedTask', SharedTaskDbSchema);
    const sharedTask = new SharedTask({ task: new mongoose.Types.ObjectId(), account: new mongoose.Types.ObjectId() });
    expect(sharedTask.active).toBe(true);
  });
});
