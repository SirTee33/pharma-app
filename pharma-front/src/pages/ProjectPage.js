import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/ProjectPage.css';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);

  // Edit states
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    status: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedCategory, sortOrder]);

  const fetchProjects = () => {
    axios.get('http://localhost:3005/projects')
      .then((response) => {
        const filteredProjects = filterAndSortProjects(response.data);
        setProjects(filteredProjects);
      })
      .catch((error) => console.error('Error fetching projects:', error));
  };

  const filterAndSortProjects = (data) => {
    let filtered = data.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter((project) =>
        project.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });

    return filtered;
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      axios.delete(`http://localhost:3005/projects/${projectId}`)
        .then(() => {
          fetchProjects();
          toast.success('Project deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting project:', error);
          toast.error('Failed to delete project.');
        });
    }
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setEditForm({
      title: project.title,
      category: project.category,
      status: project.status,
      description: project.description
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (projectId) => {
    axios.put(`http://localhost:3005/projects/${projectId}`, editForm)
      .then(() => {
        setEditingProjectId(null);
        fetchProjects();
        toast.success('Project updated successfully!');
      })
      .catch(error => {
        console.error('Error updating project:', error);
        toast.error('Failed to update project.');
      });
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <div className="project-page-container">
      <h2>All Projects</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search projects by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="category-select"
      >
        <option value="">All Categories</option>
        <option value="Clinical Research">Clinical Research</option>
        <option value="Drug Development">Drug Development</option>
        <option value="Regulatory Affairs">Regulatory Affairs</option>
      </select>

      {/* Sort By */}
      <select
        value={sortOrder}
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="asc">Sort by Title (A-Z)</option>
        <option value="desc">Sort by Title (Z-A)</option>
      </select>

      {/* Project List */}
      <div className="project-list">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <div key={project.id} className="project-card">
              {editingProjectId === project.id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
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
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                  <button onClick={() => handleSave(project.id)} className='save'>Save</button>
                  <button onClick={() => setEditingProjectId(null)} className='cancel'>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{project.title}</h3>
                  <p><strong>Category:</strong> {project.category}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Description:</strong> {project.description}</p>

                  <div className="project-actions">
                    <button onClick={() => handleEditClick(project)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(project.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;
