import React, { useEffect, useState } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useCommentContext } from '../contexts/comment.provider';
import { Comment } from '../types/comment';
import { AsyncError } from '../types';
import { GiCancel } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { GrEdit } from "react-icons/gr";



interface CommentListProps {
  taskId: string;
}

const Comments: React.FC<CommentListProps> = ({ taskId }) => {
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');
  const {
    getComments,
    commentsList: existingComments,
    isGetCommentsLoading,
    setCommentsList,
    deleteComment,
    updateComment,
  } = useCommentContext();

  useEffect(() => {
    if (!taskId) {
      return;
    }
    getComments(taskId).catch((error: AsyncError) =>
      toast.error(error.message),
    );
  }, [taskId]);

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId)
      .then(() => {
        setCommentsList(
          existingComments.filter((comment) => comment.id !== commentId),
        );
        toast.success('Comment deleted successfully');
      })
      .catch((error: AsyncError) => toast.error(error.message));
  };

  const handleEditComment = (comment: Comment) => {
    setSelectedCommentId(comment.id);
    setEditedComment(comment.comment);
  };

  const handleUpdateComment = () => {
    if (selectedCommentId) {
      updateComment(selectedCommentId, taskId, editedComment)
        .then((updatedComment) => {
          setCommentsList(
            existingComments.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          );
          setSelectedCommentId(null);
          setEditedComment('');
          toast.success('Comment updated successfully');
        })
        .catch((error: AsyncError) => toast.error(error.message));
    }
  };

  return (
    <div className="mt-4">
      {isGetCommentsLoading && <p className="text-center">Loading comments...</p>}
      {existingComments.length === 0 && <p className="text-center">No comments yet.</p>}
      <ListGroup>
        {existingComments.map((comment: Comment) => (
          <ListGroup.Item key={comment.id}>
            {selectedCommentId === comment.id ? (
              <Form>
                <Form.Group controlId="comment">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Button
                    onClick={handleUpdateComment}
                    variant="primary"
                    type="submit"
                  >
                    <GrEdit />
                  </Button>
                  <Button
                    onClick={() => setSelectedCommentId(null)}
                    variant="secondary"
                    className="ml-2"
                  >
                    <GiCancel />

                  </Button>
                </Form.Group>
              </Form>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <p className="mb-2">{comment.comment}</p>
                  <p className="text-muted">
                   
                    {`${comment.account.firstName}  (${comment.account.username})`}{' '}
                     {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="d-flex">
                  <Button
                    onClick={() => handleEditComment(comment)}
                    variant="warning"
                    className="mr-2"
                  >
                    <TbEdit />

                  </Button>
                  <Button
                    onClick={() => handleDeleteComment(comment.id)}
                    variant="danger"
                  >
                    <RiDeleteBin6Line />

                  </Button>
                </div>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Comments;

