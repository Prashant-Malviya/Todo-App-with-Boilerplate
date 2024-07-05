import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import { Account } from '../../types/account';
import AccountService from '../../services/account.service';
import SharedTaskService from '../../services/shared-task.service';
import { Task } from '../../types/task';
import { toast } from 'react-hot-toast';

const sharedTaskService = new SharedTaskService();

interface ShareTaskModalProps {
  show: boolean;
  onHide: () => void;
  task: Task;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ show, onHide, task }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await new AccountService().getAccounts({
        search,
        page,
        size: 10,
      });
      if (response.data.length === 0) {
        setError('No accounts match your search');
      } else {
        setError('');
      }
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    if (show) {
      fetchAccounts();
    }
  }, [show, fetchAccounts]);

  const handleShareTask = async () => {
    try {
      await sharedTaskService.shareTask(task.id, selectedAccounts);
      toast.success('Task shared successfully');
      onHide();
    } catch (error) {
      console.log('ERROR', error);
      toast.error('Failed to share task');
    }
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const closeModal = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Share Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="search">
            <Form.Label>Search Accounts</Form.Label>
            <Form.Control
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username"
            />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Form.Group>
          {isLoading ? (
            <div>Loading...</div>
          ) : accounts.length === 0 ? (
            <div>No accounts match your search</div>
          ) : (
            <Form.Group>
              {accounts.map((account) => (
                <Form.Check
                  key={account.id}
                  type="checkbox"
                  id={`account-${account.id}`}
                  label={`${account.firstName} ${account.lastName} (${account.username})`}
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => handleAccountSelect(account.id)}
                />
              ))}
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" disabled={selectedAccounts.length === 0} onClick={handleShareTask}>
          Share Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareTaskModal;

