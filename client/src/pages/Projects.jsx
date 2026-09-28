import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    repositoryLink: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getUserProjects();
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await projectsAPI.createProject({
        ...newProject,
        technologies: newProject.technologies.split(',').map(t => t.trim()),
      });
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        link: '',
        repositoryLink: '',
      });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (confirm('Are you sure?')) {
      try {
        await projectsAPI.deleteProject(projectId);
        fetchProjects();
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Projects 🛠️</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <div className="card mb-6">
            <form onSubmit={handleAddProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="input-field"
                rows="3"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="input-field"
              />
              <input
                type="url"
                placeholder="Project Link"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="input-field"
              />
              <input
                type="url"
                placeholder="Repository Link"
                value={newProject.repositoryLink}
                onChange={(e) => setNewProject({ ...newProject, repositoryLink: e.target.value })}
                className="input-field"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-3">{project.description}</p>
                <div className="mb-3">
                  <p className="text-sm font-semibold mb-1">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                      View
                    </a>
                  )}
                  {project.repositoryLink && (
                    <a
                      href={project.repositoryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="btn-secondary text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
