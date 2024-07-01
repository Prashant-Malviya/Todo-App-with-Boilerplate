import { Schema, Types, Document, model } from 'mongoose';

export interface IComment extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema<IComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: 'comments',
    timestamps: true,
  }
);

commentSchema.index({ task: 1, user: 1, createdAt: 1 });

const CommentModel = model<IComment>('Comment', commentSchema);
export default CommentModel;
