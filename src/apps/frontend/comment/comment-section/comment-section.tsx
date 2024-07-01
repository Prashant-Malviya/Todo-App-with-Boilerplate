import React, { useEffect, useState } from 'react';
import { Button, TextArea, VerticalStackLayout, Spinner } from '../../components';
import { getComments, createComment } from '../../api/comment-api'; // Make sure to implement these API calls
import { Comment } from '../../types/comment';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VerticalStackLayout gap={4} className="p-4 border-t mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-2 border-b">
          {comment.text}
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
