import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/CompliancePage.css';

const CompliancePage = () => {
  const [compliances, setCompliances] = useState([]);
  const [form, setForm] = useState({ document: '', status: '', reviewedBy: '', dueDate: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const res = await axios.get('http://localhost:3005/compliance');
      setCompliances(res.data);
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
      toast.error("Failed to fetch compliance data")
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3005/compliance/${editingId}`, form);
        toast.success("log updated successfully!");
      } else {
        await axios.post('http://localhost:3005/compliance', form);
        toast.success('log added successfully');
      }
      setForm({ document: '', status: '', reviewedBy: '', dueDate: '' });
      setEditingId(null);
      fetchComplianceData();
    } catch (error) {
      console.error('Failed to submit log:', error);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/compliance/${id}`);
      toast.success('log deleted successfully');
      fetchComplianceData();
    } catch (error) {
      toast.error("fail to delete log")
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="compliance-container">
      <h2 className="session-title">Regulatory Compliance Overview</h2>

      <form className="compliance-form" onSubmit={handleSubmit}>
        <input name="document" value={form.document} onChange={handleChange} placeholder="Document" required />
        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
        <input name="reviewedBy" value={form.reviewedBy} onChange={handleChange} placeholder="Reviewed By" required />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Compliance</button>
      </form>

      <table className="compliance-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Status</th>
            <th>Reviewed By</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {compliances.map(item => (
            <tr key={item.id}>
              <td>{item.document}</td>
              <td className={item.status === 'Approved' ? 'approved' : 'pending'}>{item.status}</td>
              <td>{item.reviewedBy}</td>
              <td>{item.dueDate}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompliancePage;
