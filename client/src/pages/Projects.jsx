import { useEffect, useState } from "react";
import { projectAPI } from "../api/api";
import { useAuth } from "../store/auth";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { Plus, FolderKanban, Search, Sparkles } from "lucide-react";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(data.projects || []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.warn("Project name is required");
    setCreating(true);
    try {
      await projectAPI.create(form);
      toast.success("Project created! 🎉");
      setForm({ name: "", description: "" });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? All tasks will also be removed.")) return;
    try {
      await projectAPI.remove(id);
      toast.success("Project deleted");
      setProjects((p) => p.filter((proj) => proj._id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="animate-spin w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Projects</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Your Projects</h1>
          <p className="text-gray-400 mt-1">Manage and organize your team projects</p>
        </div>
        <button
          id="create-project-btn"
          onClick={() => setShowModal(true)}
          className="glass-button flex items-center gap-2 self-start"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="project-search"
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input pl-10"
          />
        </div>
      )}

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban size={60} className="mx-auto mb-4 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">
            {search ? "No projects found" : "No projects yet"}
          </h2>
          <p className="text-gray-500 mb-6">
            {search ? "Try a different search term" : "Create your first project to get started!"}
          </p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="glass-button inline-flex items-center gap-2">
              <Plus size={18} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onDelete={handleDelete}
              currentUserId={user?._id}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4" id="create-project-form">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Project Name</label>
            <input
              id="project-name-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My Awesome Project"
              className="glass-input"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Description</label>
            <textarea
              id="project-desc-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's this project about?"
              className="glass-input min-h-[100px] resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary flex-1">
              Cancel
            </button>
            <button id="submit-project-btn" type="submit" disabled={creating} className="glass-button flex-1 flex items-center justify-center gap-2">
              {creating ? (
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <><Plus size={16} /> Create</>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
