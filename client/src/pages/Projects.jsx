import { useEffect, useState } from "react";
import { projectAPI } from "../api/api";
import { useAuth } from "../store/auth";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { Plus, FolderKanban, Search } from "lucide-react";

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
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.warn("Project name is required");
    setCreating(true);
    try {
      await projectAPI.create(form);
      toast.success("Project created");
      setForm({ name: "", description: "" });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || "Could not create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await projectAPI.remove(id);
      toast.success("Project deleted");
      setProjects((p) => p.filter((proj) => proj._id !== id));
    } catch (err) {
      toast.error(err.message || "Could not delete project");
    }
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><span className="spinner" /></div>;

  return (
    <div className="page-container fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <div>
          <p className="section-label">Workspace</p>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and organize your team projects</p>
        </div>
        <button id="create-project-btn" onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> New project
        </button>
      </div>

      {projects.length > 0 && (
        <div style={{ position: "relative", maxWidth: 360, marginBottom: 24 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
          <input
            id="project-search"
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={48} className="empty-state-icon" style={{ margin: "0 auto 12px" }} />
          <p className="empty-state-title">{search ? "No matching projects" : "No projects yet"}</p>
          <p className="empty-state-text">{search ? "Try a different search term." : "Create your first project to start collaborating."}</p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
              <Plus size={14} /> Create project
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map((proj) => (
            <ProjectCard key={proj._id} project={proj} onDelete={handleDelete} currentUserId={user?._id} />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New project">
        <form onSubmit={handleCreate} id="create-project-form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-name-input">Name</label>
            <input id="project-name-input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Marketing Website" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="project-desc-input">Description</label>
            <textarea id="project-desc-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the project" className="form-textarea" rows={3} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button id="submit-project-btn" type="submit" disabled={creating} className="btn btn-primary" style={{ flex: 1 }}>
              {creating ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : "Create project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
