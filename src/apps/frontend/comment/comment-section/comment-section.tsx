import React, { useEffect, useState } from 'react';
import { Button, TextArea, VerticalStackLayout, Spinner, LabelLarge } from '../../components';
import { getComments, createComment, updateComment, deleteComment } from '../../api/comment-api';
import { Comment } from '../../types/comment';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await getComments(taskId);
        setComments(response);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleCommentSubmit = async () => {
    try {
      const newComment = await createComment(taskId, commentText);
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      const updatedComment = await updateComment(commentId, editedCommentText);
      setComments(
        comments.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Failed to update comment', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VerticalStackLayout gap={4} className="p-4 border-t mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-2 border-b">
          {editingCommentId === comment.id ? (
            <div>
              <TextArea
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
              />
              <Button onClick={() => handleEditComment(comment.id)} disabled={!editedCommentText.trim()}>
                Save
              </Button>
              <Button onClick={() => setEditingCommentId(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <LabelLarge>{comment.text}</LabelLarge>
              <Button onClick={() => {
                setEditingCommentId(comment.id);
                setEditedCommentText(comment.text);
              }}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteComment(comment.id)}>
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
      <TextArea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
        Submit Comment
      </Button>
    </VerticalStackLayout>
  );
};

export default CommentSection;
