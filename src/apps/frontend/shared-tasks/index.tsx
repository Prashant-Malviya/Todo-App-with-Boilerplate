import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from 'react-bootstrap';
import axios from 'axios';

import { SharedTask } from '.././types/shared-task';

const SharedTasks: React.FC = () => {
  const [sharedTasks, setSharedTasks] = useState<SharedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSharedTasks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<SharedTask[]>('/api/shared-tasks');
        setSharedTasks(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedTasks();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Shared Tasks</CardTitle>
            </CardHeader>
            <CardBody>
              {sharedTasks.map((sharedTask) => (
                <Card key={sharedTask.id}>
                  <CardHeader>
                    <CardTitle>{sharedTask.task.title}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p>{sharedTask.task.description}</p>
                    <p>
                      Shared by:{' '}
                      {`${sharedTask.task.account.firstName} ${sharedTask.task.account.lastName}`}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SharedTasks;

