import React, { useState } from 'react';
import { useCommentContext } from '../contexts/comment.provider';
import toast from 'react-hot-toast';
import { Form, Button } from 'react-bootstrap';

interface AddCommentProps {
  taskId: string;
}

const NewComment: React.FC<AddCommentProps> = ({ taskId }) => {
  const [comment, setComment] = useState('');
  const { addComment, setCommentsList, commentsList } = useCommentContext();

  const handleNewComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const newComment = await addComment(taskId, comment);
      setCommentsList([...commentsList, newComment]);
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="mt-4">
      <Form.Control
        as="textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        rows={3}
      />
      <Button
        variant="primary"
        type="submit"
        onClick={handleNewComment}
        className="mt-2"
      >
        Add Comment
      </Button>
    </div>
  );
};

export default NewComment;

