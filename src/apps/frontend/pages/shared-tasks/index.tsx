import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { VerticalStackLayout, HeadingMedium, Button } from '../../components';
import { useTaskContext } from '../../contexts';
import { CommentSection } from './comment-section';
import { ButtonKind, ButtonSize } from '../../types/button';

const SharedTasks: React.FC = () => {
  const { getSharedTasks, isGetSharedTasksLoading, sharedTasksList } = useTaskContext();
  const userAccessToken = JSON.parse(localStorage.getItem('access-token') || '{}');
  const accountId = useMemo(() => userAccessToken.accountId, [userAccessToken]);

  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  const getSharedTasksCallback = useCallback(() => {
    getSharedTasks(accountId);
  }, [getSharedTasks, accountId]);

  useEffect(() => {
    getSharedTasksCallback();
  }, [getSharedTasksCallback]);

  const toggleComments = (taskId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="mx-auto h-screen max-w-screen-2xl overflow-y-auto p-4 md:p-6 2xl:p-10">
      <div className="mx-auto max-w-5xl">
        <VerticalStackLayout gap={7}>
          <HeadingMedium>Shared Tasks</HeadingMedium>
          {isGetSharedTasksLoading ? (
            <div>Loading...</div>
          ) : (
            sharedTasksList.map((sharedTask) => (
              <div
                key={sharedTask.task.taskId}
                className="p-4 mb-4 border rounded-lg shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold">
                  {sharedTask.task.title}
                </h3>
                <p>{sharedTask.task.description}</p>
                <p className="text-sm text-gray-500">
                  shared by: {sharedTask.sharedBy}
                </p>
                <p className="text-sm text-gray-500">
                  Shared at: {new Date(sharedTask.sharedAt).toLocaleString()}
                </p>
                <Button
                  onClick={() => toggleComments(sharedTask.task.taskId)}
                  kind={ButtonKind.SECONDARY}
                  size={ButtonSize.DEFAULT}
                >
                  {showComments[sharedTask.task.taskId] ? 'Hide Comments' : 'Show Comments'}
                </Button>
                {showComments[sharedTask.task.taskId] && (
                  <CommentSection taskId={sharedTask.task.taskId} />
                )}
              </div>
            ))
          )}
        </VerticalStackLayout>
      </div>
    </div>
  );
};

export default SharedTasks;
