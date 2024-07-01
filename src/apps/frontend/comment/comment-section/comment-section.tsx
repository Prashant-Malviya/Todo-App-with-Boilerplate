import React, { useEffect, useState } from 'react';
import { getComments, createComment, updateComment, deleteComment } from './comment-api';
import { Comment } from '../../types/comment';
import { VerticalStackLayout, Button, Input, Spinner } from '../../components';
import { ButtonKind, ButtonSize } from '../../types/button';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(taskId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleCreateComment = async () => {
    try {
      const newCommentObj = await createComment(taskId, newComment);
      setComments([...comments, newCommentObj]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment', error);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      const updatedComment = await updateComment(commentId, editingCommentText);
      setComments(
        comments.map((comment) =>
          comment.commentId === commentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error('Failed to update comment', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VerticalStackLayout gap={3}>
      {comments.map((comment) => (
        <div key={comment.commentId} className="p-2 border-b">
          {editingCommentId === comment.commentId ? (
            <>
              <Input
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
              />
              <Button
                onClick={() => handleUpdateComment(comment.commentId)}
                kind={ButtonKind.PRIMARY}
                size={ButtonSize.DEFAULT}
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  setEditingCommentId(null);
                  setEditingCommentText('');
                }}
                kind={ButtonKind.SECONDARY}
                size={ButtonSize.DEFAULT}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <p>{comment.comment}</p>
              <Button
                onClick={() => {
                  setEditingCommentId(comment.commentId);
                  setEditingCommentText(comment.comment);
                }}
                kind={ButtonKind.SECONDARY}
                size={ButtonSize.SMALL}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteComment(comment.commentId)}
                kind={ButtonKind.DANGER}
                size={ButtonSize.SMALL}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ))}
      <Input
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button onClick={handleCreateComment} kind={ButtonKind.PRIMARY} size={ButtonSize.DEFAULT}>
        Add Comment
      </Button>
    </VerticalStackLayout>
  );
};

export default CommentSection;
