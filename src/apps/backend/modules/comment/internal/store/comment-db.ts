import { Schema, Types } from 'mongoose';

export interface CommentDB {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  account: Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentDbSchema: Schema = new Schema<CommentDB>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      index: true,
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true,
    },
    
    comment: {
      type: String,
      required: true,
      active: true,
    },
  },
  {
    collection: 'comments',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
