import { useState } from 'react';
import { createProject } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/CreateProject.css';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await createProject({
        title,
        description,
        category,
        status
      });
      setTitle('');
      setDescription('');
      setCategory('');
      setStatus('Pending');
      setError('');
      toast.success('Pharmaceutical Project Created Successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error creating project.');
    }
  };

  return (
    <div className="create-project">
      <h1>Create New Pharma Project</h1>
      <form onSubmit={handleSubmit} className="create-project-form">
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            placeholder="e.g. Cancer Drug Phase 1 Trial"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Project Description</label>
          <textarea
            placeholder="Enter detailed project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="e.g. Clinical Research, Regulatory Approval"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;
