import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import '../styles/TaskList.css';

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', dueDate: '', status: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = () => {
    axios.get('http://localhost:3005/tasks')
      .then(res => {
        const filtered = res.data.filter(task => task.projectId === projectId);
        setTasks(filtered);
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:3005/tasks/${taskId}`)
      .then(() => {
        fetchTasks();
        toast.success('Task deleted successfully!');
      })
      .catch(err => {
        console.error('Delete failed:', err);
        toast.error('Failed to delete task.');
      });
  };

  const toggleCompletion = (task) => {
    const updatedStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    axios.patch(`http://localhost:3005/tasks/${task.id}`, { status: updatedStatus })
      .then(() => {
        fetchTasks();
        toast.success(`Task marked as ${updatedStatus}`);
      })
      .catch(err => {
        console.error('Status update failed:', err);
        toast.error('Failed to update task status.');
      });
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditForm({ title: task.title, dueDate: task.dueDate, status: task.status });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    axios.put(`http://localhost:3005/tasks/${editingTaskId}`, editForm)
      .then(() => {
        setEditingTaskId(null);
        setIsModalOpen(false);
        fetchTasks();
        toast.success('Task updated successfully!');
      })
      .catch(err => {
        console.error('Edit failed:', err);
        toast.error('Failed to update task.');
      });
  };

  return (
    <div className="tasklist-container">
      <h4>Tasks</h4>
      <ul className="tasklist">
        {tasks.map(task => (
          <li key={task.id} className={`task priority-${task.priority.toLowerCase()}`}>
            <div className="task-view">
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => toggleCompletion(task)}
                />
                <span><strong>{task.title}</strong> ({task.status})</span>
              </div>
              <div className="task-meta">
                Due: {task.dueDate} | Priority: {task.priority}
              </div>
              <div className="task-actions">
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              placeholder="Title"
            />
            <input
              name="dueDate"
              type="date"
              value={editForm.dueDate}
              onChange={handleEditChange}
            />
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
