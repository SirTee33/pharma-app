import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ReportPage.css';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: '',
    date: '',
    summary: '',
    link: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:3005/reports');
      setReports(res.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3005/reports/${editingId}`, newReport);
        toast.success('Report updated successfully');
      } else {
        await axios.post('http://localhost:3005/reports', newReport);
        toast.success('Report added successfully');
      }
      resetForm();
      fetchReports();
    } catch (err) {
      toast.error('Error saving report');
      console.error(err);
    }
  };

  const handleEdit = (report) => {
    setNewReport({
      title: report.title,
      date: report.date,
      summary: report.summary,
      link: report.link
    });
    setEditingId(report.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/reports/${id}`);
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (err) {
      toast.error('Error deleting report');
      console.error("Delete error");
    }
  };

  const resetForm = () => {
    setNewReport({ title: '', date: '', summary: '', link: '' });
    setEditingId(null);
  };

  return (
    <div className="report-container">
      <h2 className="session-title">Project Reports</h2>

      <form className="report-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Report Title"
          value={newReport.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newReport.date}
          onChange={handleChange}
          required
        />
        <textarea
          name="summary"
          placeholder="Summary"
          value={newReport.summary}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="url"
          name="link"
          placeholder="Report Link"
          value={newReport.link}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update Report' : 'Add Report'}</button>
        {editingId && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </form>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        reports.map((report) => (
          <div className="report-card" key={report.id}>
            <h4>{report.title}</h4>
            <p><strong>Date:</strong> {report.date}</p>
            <p><strong>Summary:</strong> {report.summary}</p>
            <a href={report.link} target="_blank" rel="noopener noreferrer">
              View Full Report
            </a>
            <div className="report-actions">
              <button onClick={() => handleEdit(report)}>Edit</button>
              <button onClick={() => handleDelete(report.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReportPage;
